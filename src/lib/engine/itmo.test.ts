import { describe, expect, it } from 'vitest';
import {
  buildItmoTest, computeItmoScores, computeItmoSwipeScores, ITMO_PROGRAMS, ITMO_SWIPE_PARTS,
  itmoDirections, seededRngFactory, itmoRequirements, ITMO_EXAM_SETS
} from '../data/itmo';
import { STAGE2_QUESTIONS } from '../data/directions';

const factorOf = (id: string) => (id.endsWith('_1') ? 2 : id.endsWith('_2') ? 1 : id.endsWith('_3') ? -1 : -2);

describe('buildItmoTest', () => {
  it('берёт по 2 вопроса из каждого выбранного направления в равной мере', () => {
    const test = buildItmoTest(['dev', 'data', 'infra'], 2, Math.random);
    expect(test).toHaveLength(6);
    const byDir = new Map<string, number>();
    for (const q of test) byDir.set(q.directionId, (byDir.get(q.directionId) ?? 0) + 1);
    expect(byDir.get('dev')).toBe(2);
    expect(byDir.get('data')).toBe(2);
    expect(byDir.get('infra')).toBe(2);
  });

  it('не дублирует вопросы внутри сборки', () => {
    const test = buildItmoTest(itmoDirections(), 2, Math.random);
    const ids = new Set(test.map((q) => q.id));
    expect(ids.size).toBe(test.length);
  });

  it('перемешивает направления: вопросы разных направлений идут вперемешку', () => {
    const test = buildItmoTest(itmoDirections(), 2, Math.random);
    const dirs = test.map((q) => q.directionId);
    const blocks = dirs.reduce<number>((acc, d, i) => (i === 0 || d !== dirs[i - 1] ? acc + 1 : acc), 0);
    expect(blocks).toBeGreaterThan(1);
  });

  it('детерминирован при одинаковом seed', () => {
    const a = buildItmoTest(['dev', 'data'], 2, seededRngFactory(42));
    const b = buildItmoTest(['dev', 'data'], 2, seededRngFactory(42));
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it('разные seed дают разную сборку', () => {
    const a = buildItmoTest(['dev', 'data'], 2, seededRngFactory(1));
    const b = buildItmoTest(['dev', 'data'], 2, seededRngFactory(2));
    expect(a.map((q) => q.id)).not.toEqual(b.map((q) => q.id));
  });

  it('вопросы берутся из пула STAGE2_QUESTIONS соответствующего направления', () => {
    const test = buildItmoTest(['dev'], 2, Math.random);
    const devPool = new Set(STAGE2_QUESTIONS['dev'].map((q) => q.id));
    for (const q of test) expect(devPool.has(q.id.split(':')[1])).toBe(true);
  });

  it('все программы привязаны к существующим направлениям', () => {
    const known = new Set(['dev', 'data', 'product', 'marketing', 'mgmt', 'infra', 'people']);
    for (const p of ITMO_PROGRAMS) expect(known.has(p.directionId)).toBe(true);
  });

  it('у каждой программы есть требования: комбинация из 3 предметов ЕГЭ', () => {
    const knownSets = new Set([
      ITMO_EXAM_SETS.MIR, ITMO_EXAM_SETS.MFR, ITMO_EXAM_SETS.MBR, ITMO_EXAM_SETS.MHR,
      ITMO_EXAM_SETS.MOR, ITMO_EXAM_SETS.MIYaR, ITMO_EXAM_SETS.LOR
    ].map((s) => s.join('|')));
    for (const p of ITMO_PROGRAMS) {
      const req = itmoRequirements(p);
      expect(req.exams.length).toBeGreaterThan(0);
      for (const set of req.exams) {
        expect(set).toHaveLength(3);
        expect(set.every((s) => typeof s === 'string' && s.length > 0)).toBe(true);
        expect(knownSets.has(set.join('|'))).toBe(true);
      }
      expect(req.minBalls).toBeGreaterThanOrEqual(36);
      expect(req.minBalls).toBeLessThanOrEqual(100);
      if (req.minBySubject) {
        for (const v of Object.values(req.minBySubject)) {
          expect(v).toBeGreaterThanOrEqual(req.minBalls);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('у каждого кода направления — корректная комбинация ЕГЭ (не пустая и без дублей предметов)', () => {
    for (const p of ITMO_PROGRAMS) {
      const req = itmoRequirements(p);
      for (const set of req.exams) {
        expect(new Set(set).size).toBe(set.length);
      }
    }
  });
});

describe('computeItmoScores', () => {
  it('positive ответы поднимают программы своего направления выше остальных', () => {
    const test = buildItmoTest(['dev', 'data'], 2, seededRngFactory(7));
    const answers: Record<string, string> = {};
    for (const q of test) {
      if (q.directionId === 'dev') answers[q.id] = `${q.id}_1`;
      else answers[q.id] = `${q.id}_4`;
    }
    const scores = computeItmoScores(answers, test, factorOf);
    const topDir = scores[0].program.directionId;
    expect(topDir).toBe('dev');
    const devScores = scores.filter((s) => s.program.directionId === 'dev');
    for (const s of devScores) expect(s.percent).toBeGreaterThan(50);
  });

  it('учитывает приоритет: программы с высоким приоритетом не штрафуются при сильных ответах', () => {
    const test = buildItmoTest(['dev'], 2, seededRngFactory(9));
    const answers: Record<string, string> = {};
    for (const q of test) answers[q.id] = `${q.id}_1`;
    const scores = computeItmoScores(answers, test, factorOf);
    expect(scores.length).toBeGreaterThan(0);
    expect(scores[0].percent).toBe(100);
  });

  it('все проценты в диапазоне 0–100', () => {
    const test = buildItmoTest(itmoDirections(), 2, seededRngFactory(3));
    const answers: Record<string, string> = {};
    test.forEach((q, i) => {
      answers[q.id] = `${q.id}_${(i % 4) + 1}`;
    });
    const scores = computeItmoScores(answers, test, factorOf);
    for (const s of scores) {
      expect(s.percent).toBeGreaterThanOrEqual(0);
      expect(s.percent).toBeLessThanOrEqual(100);
    }
  });

  it('не показывает программы без ответов', () => {
    const test = buildItmoTest(['dev'], 2, Math.random);
    const scores = computeItmoScores({}, test, factorOf);
    expect(scores).toHaveLength(0);
  });
});

describe('свайп-тест ИТМО', () => {
  it('каждая программа каталога относится ровно к одной части', () => {
    const programParts = new Map<string, string[]>();
    for (const part of ITMO_SWIPE_PARTS) {
      for (const pid of part.programIds) {
        const list = programParts.get(pid) ?? [];
        list.push(part.id);
        programParts.set(pid, list);
      }
    }
    expect(programParts.size).toBe(ITMO_PROGRAMS.length);
    for (const [pid, parts] of programParts) {
      expect(parts.length).toBe(1);
    }
  });

  it('части не пустые и содержат уникальные вопросы (итого 32)', () => {
    const all = ITMO_SWIPE_PARTS.flatMap((p) => p.questions);
    const ids = new Set(all.map((q) => q.id));
    for (const part of ITMO_SWIPE_PARTS) {
      expect(part.programIds.length).toBeGreaterThan(0);
      expect(part.questions.length).toBeGreaterThanOrEqual(2);
      for (const q of part.questions) expect(q.statement.trim().length).toBeGreaterThan(10);
    }
    expect(ids.size).toBe(all.length);
    const total = ITMO_SWIPE_PARTS.reduce((acc, p) => acc + p.questions.length, 0);
    expect(total).toBe(32);
  });

  it('все программы частей существуют в каталоге (23)', () => {
    const ids = new Set(ITMO_PROGRAMS.map((p) => p.id));
    for (const part of ITMO_SWIPE_PARTS) {
      for (const pid of part.programIds) expect(ids.has(pid)).toBe(true);
    }
  });

  it('все „да" в одной части дают 100% только программам этой части', () => {
    const answers: Record<string, boolean> = {};
    const first = ITMO_SWIPE_PARTS[0];
    for (const q of first.questions) answers[q.id] = true;
    const scores = computeItmoSwipeScores(answers);
    const partPrograms = new Set(first.programIds);
    expect(scores.length).toBe(partPrograms.size);
    for (const s of scores) {
      expect(partPrograms.has(s.program.id)).toBe(true);
      expect(s.percent).toBe(100);
      expect(s.partTitle).toBe(first.title);
    }
  });

  it('без ответов — пустой результат', () => {
    expect(computeItmoSwipeScores({})).toHaveLength(0);
  });

  it('частичные ответы дают процент = доля согласий', () => {
    const first = ITMO_SWIPE_PARTS[0];
    const answers: Record<string, boolean> = {};
    first.questions.forEach((q, i) => {
      answers[q.id] = i % 2 === 0;
    });
    const scores = computeItmoSwipeScores(answers);
    const expected = Math.round((Math.ceil(first.questions.length / 2) / first.questions.length) * 100);
    const scoresOfPart = scores.filter((s) => s.partId === first.id);
    expect(scoresOfPart).toHaveLength(first.programIds.length);
    for (const s of scoresOfPart) expect(s.percent).toBe(expected);
  });

  it('смешанные части: каждая часть влияет только на свои программы', () => {
    const answers: Record<string, boolean> = {};
    for (const q of ITMO_SWIPE_PARTS[0].questions) answers[q.id] = true;
    for (const q of ITMO_SWIPE_PARTS[1].questions) answers[q.id] = false;
    const scores = computeItmoSwipeScores(answers);
    const top = scores[0];
    expect(top.percent).toBe(100);
    expect(top.partId).toBe(ITMO_SWIPE_PARTS[0].id);
    const secondPartPrograms = new Set(ITMO_SWIPE_PARTS[1].programIds);
    for (const s of scores) {
      if (!secondPartPrograms.has(s.program.id)) continue;
      expect(s.percent).toBe(0);
    }
  });

  it('срез не превышает 8 программ', () => {
    const answers: Record<string, boolean> = {};
    for (const part of ITMO_SWIPE_PARTS) for (const q of part.questions) answers[q.id] = true;
    expect(computeItmoSwipeScores(answers).length).toBeLessThanOrEqual(8);
  });
});
