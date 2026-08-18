import { describe, expect, it } from 'vitest';
import {
  advanceQuestion, backQuestion, computeDirectionScores, computePsychology, computeRoleBoost,
  confirmDirection, jumpToQuestion, quizAnswers, quizIndex, quizPhase, selectAnswer,
  startAudit, view
} from '../stores/profile';
import { STAGE1_QUESTIONS, stage2QuestionsFor } from '../data/directions';
import { ROLES } from '../data/roles';
import { findTopMatches } from './matching';
import type { View, QuizPhase } from '../stores/profile';
import type { UserProfileState } from '../types';

const psych = computePsychology({
  d1: 'strongly_yes', d2: 'strongly_yes', d3: 'yes', d9: 'yes',
  data1: 'yes', data2: 'strongly_yes'
});

const profile: Pick<UserProfileState, 'psychology' | 'skills' | 'currentSalaryRub' | 'weeklyLearningHours'> = {
  psychology: psych,
  skills: [
    { skillId: 'python', level: 4, confidenceScore: 0.8 },
    { skillId: 'sql', level: 3, confidenceScore: 0.7 },
    { skillId: 'data_analysis', level: 3, confidenceScore: 0.7 },
    { skillId: 'communication', level: 4, confidenceScore: 0.8 }
  ],
  currentSalaryRub: 120000,
  weeklyLearningHours: 8
};

describe('Тест 1: направления', () => {
  it('сильные «да» в разработку и «нет» в инфраструктуру дают перевес dev', () => {
    const scores = computeDirectionScores({ d1: 'strongly_yes', d6: 'strongly_no' });
    expect(scores.dev).toBeGreaterThan(scores.infra);
    expect(scores.dev).toBeGreaterThan(scores.marketing);
  });

  it('нет ответов — все направления на нуле', () => {
    const scores = computeDirectionScores({});
    expect(Object.values(scores).every((s) => s === 0)).toBe(true);
  });

  it('отрицательный ответ снижает направление', () => {
    const yes = computeDirectionScores({ d4: 'strongly_yes' });
    const no = computeDirectionScores({ d4: 'strongly_no' });
    expect(yes.marketing).toBeGreaterThan(0);
    expect(no.marketing).toBeLessThan(0);
  });
});

describe('Тест 2: буст специализаций', () => {
  it('«да» на бэкенд-вопрос повышает роли бэкенда', () => {
    const boost = computeRoleBoost({ dev1: 'yes' });
    expect(boost['backend_python'] ?? 0).toBeGreaterThan(0);
    expect(boost['frontend_developer'] ?? 0).toBeGreaterThan(0);
  });

  it('«нет» на вопрос про железо не бустит embedded', () => {
    const boost = computeRoleBoost({ dev5: 'strongly_no' });
    expect(boost['embedded_dev'] ?? 0).toBeLessThan(0);
  });

  it('буст поднимает предпочитаемую роль выше в топ-5', () => {
    const boostA: Record<string, number> = {};
    boostA['data_analyst'] = 2;
    const withBoost = findTopMatches(profile, ROLES, 5, boostA);
    const boostB: Record<string, number> = {};
    boostB['web_analyst'] = 2;
    const withOther = findTopMatches(profile, ROLES, 5, boostB);

    const rankA = withBoost.findIndex((m) => m.roleId === 'data_analyst');
    const rankB = withOther.findIndex((m) => m.roleId === 'data_analyst');
    expect(rankA).toBeGreaterThanOrEqual(0);
    expect(rankB).toBeGreaterThanOrEqual(0);
    expect(rankA).toBeLessThanOrEqual(2);
    expect(rankA).toBeLessThan(rankB);
  });
});

describe('Психологический вектор из двух тестов', () => {
  it('явное предпочтение данных даёт высокий investigative', () => {
    const p = computePsychology({ d2: 'strongly_yes', d9: 'strongly_yes', data2: 'strongly_yes' });
    expect(p.investigative).toBeGreaterThan(p.enterprising);
    expect(p.investigative).toBeGreaterThan(p.realistic);
  });

  it('вектор ограничен диапазоном [0,1]', () => {
    const p = computePsychology({ d4: 'strongly_yes', d5: 'strongly_yes' });
    for (const v of Object.values(p)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('Навигация по тестам', () => {
  it('selectAnswer записывает ответ, не переходя дальше', () => {
    startAudit();
    selectAnswer('strongly_yes');
    let a: Record<string, string> = {};
    quizAnswers.subscribe((v) => (a = v))();
    let i = -1;
    quizIndex.subscribe((v) => (i = v))();
    expect(a.d1).toBe('strongly_yes');
    expect(i).toBe(0);
  });

  it('advanceQuestion идёт по тесту 1 и ведёт к checkpoint в конце', () => {
    startAudit();
    advanceQuestion();
    let i = -1;
    quizIndex.subscribe((v) => (i = v))();
    expect(i).toBe(1);
    for (let k = 0; k < STAGE1_QUESTIONS.length; k++) advanceQuestion();
    let p: QuizPhase = 'stage1';
    quizPhase.subscribe((v) => (p = v))();
    expect(p).toBe('checkpoint');
  });

  it('jumpToQuestion ограничивает индекс диапазоном', () => {
    startAudit();
    jumpToQuestion(999);
    let i = -1;
    quizIndex.subscribe((v) => (i = v))();
    expect(i).toBe(STAGE1_QUESTIONS.length - 1);
    jumpToQuestion(-5);
    quizIndex.subscribe((v) => (i = v))();
    expect(i).toBe(0);
  });

  it('подтверждение направления запускает тест 2, его конец ведёт к навыкам', () => {
    startAudit();
    confirmDirection('data');
    let p: QuizPhase = 'stage1';
    quizPhase.subscribe((v) => (p = v))();
    let i = -1;
    quizIndex.subscribe((v) => (i = v))();
    expect(p).toBe('stage2');
    expect(i).toBe(0);
    expect(stage2QuestionsFor('data').length).toBeGreaterThan(5);
    for (let k = 0; k < stage2QuestionsFor('data').length; k++) advanceQuestion();
    let v: View = 'start';
    view.subscribe((x) => (v = x))();
    expect(v).toBe('skills');
  });

  it('backQuestion из теста 2 на первом вопросе возвращает к checkpoint', () => {
    startAudit();
    confirmDirection('dev');
    backQuestion();
    let p: QuizPhase = 'stage1';
    quizPhase.subscribe((x) => (p = x))();
    expect(p).toBe('checkpoint');
  });
});