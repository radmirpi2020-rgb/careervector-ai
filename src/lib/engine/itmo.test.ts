import { describe, expect, it } from 'vitest';
import {
  buildItmoTest, computeItmoScores, ITMO_PROGRAMS, itmoDirections, seededRngFactory
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
