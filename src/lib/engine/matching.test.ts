import { describe, expect, it } from 'vitest';
import {
  buildRoadmap,
  findTopMatches,
  psychologicalFit,
  skillOwnership,
  skillOverlap,
  transitionFeasibilityIndex
} from './matching';
import { ROLES } from '../data/roles';
import { SKILLS } from '../data/skills';
import type { PsychologicalVector, UserProfileState } from '../types';

const psych: PsychologicalVector = {
  realistic: 0.6,
  investigative: 0.85,
  artistic: 0.2,
  social: 0.35,
  enterprising: 0.4,
  conventional: 0.5,
  ambiguityTolerance: 0.6,
  peopleInteractionLoad: 0.4,
  autonomyPreference: 0.7
};

const profile: Pick<UserProfileState, 'psychology' | 'skills' | 'currentSalaryRub' | 'weeklyLearningHours'> = {
  psychology: psych,
  skills: [
    { skillId: 'python', level: 4, confidenceScore: 0.8 },
    { skillId: 'sql', level: 4, confidenceScore: 0.8 },
    { skillId: 'data_analysis', level: 4, confidenceScore: 0.8 },
    { skillId: 'statistics', level: 3, confidenceScore: 0.7 },
    { skillId: 'communication', level: 4, confidenceScore: 0.8 },
    { skillId: 'pandas', level: 4, confidenceScore: 0.8 },
    { skillId: 'excel', level: 4, confidenceScore: 0.8 },
    { skillId: 'dashboards', level: 3, confidenceScore: 0.7 }
  ],
  currentSalaryRub: 150000,
  weeklyLearningHours: 8
};

describe('психометрическое соответствие (Fit_psych)', () => {
  it('идентичные профили дают 100%', () => {
    expect(psychologicalFit(psych, psych)).toBeCloseTo(1, 5);
  });

  it('противоположные профили дают низкий фит', () => {
    const opposite: PsychologicalVector = {
      realistic: 0.05, investigative: 0.05, artistic: 0.95, social: 0.95,
      enterprising: 0.9, conventional: 0.05,
      ambiguityTolerance: 0.2, peopleInteractionLoad: 0.9, autonomyPreference: 0.2
    };
    expect(psychologicalFit(psych, opposite)).toBeLessThan(0.1);
  });
});

describe('владельческий коэффициент C_k', () => {
  it('уровень >= требуемому даёт 1.0', () => {
    expect(skillOwnership(4, 3)).toBe(1);
    expect(skillOwnership(3, 3)).toBe(1);
  });
  it('частичный уровень пропорционален', () => {
    expect(skillOwnership(2, 4)).toBe(0.5);
  });
  it('отсутствие навыка даёт 0', () => {
    expect(skillOwnership(undefined, 3)).toBe(0);
  });
});

describe('скилл-оверлэп и мандаторный фильтр', () => {
  const role = ROLES.find((r) => r.id === 'data_scientist')!;

  it('пользователь с закрытыми мандаторными навыками частично совпадает', () => {
    const role = ROLES.find((r) => r.id === 'data_analyst')!;
    const { matchScore } = skillOverlap(role, profile.skills);
    expect(matchScore).toBeGreaterThan(0);
    expect(matchScore).toBeLessThan(1);
  });

  it('отсутствие мандаторного навыка обнуляет матч', () => {
    const withoutPython = profile.skills.filter((s) => s.skillId !== 'python');
    const { matchScore, details } = skillOverlap(role, withoutPython);
    expect(details.find((d) => d.skill.id === 'python')?.isMandatory).toBe(true);
    expect(matchScore).toBe(0);
  });
});

describe('TFI — индекс реализуемости перехода', () => {
  it('штраф за время обучения и премия за зарплату', () => {
    const base = transitionFeasibilityIndex(0.7, 0.9, 300, 200000, 150000);
    const slow = transitionFeasibilityIndex(0.7, 0.9, 900, 200000, 150000);
    const rich = transitionFeasibilityIndex(0.7, 0.9, 300, 400000, 150000);
    expect(slow).toBeLessThan(base);
    expect(rich).toBeGreaterThan(base);
  });
});

describe('полный конвейер матчинга', () => {
  it('возвращает топ-5 ролей с дормапами', () => {
    const matches = findTopMatches(profile, ROLES, 5);
    expect(matches.length).toBe(5);
    for (const m of matches) {
      expect(m.roleId).toBeTruthy();
      expect(m.overallMatchScorePercent).toBeGreaterThanOrEqual(0);
      expect(m.psychologicalFitPercent).toBeGreaterThan(0);
      expect(Array.isArray(m.roadmap)).toBe(true);
    }
  });

  it('аналитик данных входит в топ-5 для аналитического профиля', () => {
    const matches = findTopMatches(profile, ROLES, 5);
    const ids = matches.map((m) => m.roleId);
    expect(ids).toContain('data_analyst');
  });

  it('все roadmap-шаги имеют навыки, ресурсы и артефакт', () => {
    const role = ROLES.find((r) => r.id === 'product_analyst')!;
    const roadmap = buildRoadmap(role, profile, skillOverlap(role, profile.skills).details);
    for (const step of roadmap) {
      expect(step.targetSkillIds.length).toBeGreaterThan(0);
      expect(step.freeResourceLinks.length).toBeGreaterThan(0);
      expect(step.practiceMilestoneProject.length).toBeGreaterThan(5);
      expect(step.estimatedWeeks).toBeGreaterThan(0);
    }
  });
});

describe('целостность каталога', () => {
  it('каталог содержит не менее 150 ролей (спецификация v1.0)', () => {
    expect(ROLES.length).toBeGreaterThanOrEqual(150);
  });

  it('все ссылки на навыки в ролях существуют в онтологии', () => {
    for (const role of ROLES) {
      for (const rs of role.requiredSkills) {
        expect(SKILLS[rs.skillId], `роль ${role.id}: навык ${rs.skillId}`).toBeDefined();
      }
    }
  });

  it('id ролей уникальны', () => {
    const ids = ROLES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('у каждой роли есть мандаторные навыки', () => {
    for (const role of ROLES) {
      expect(role.requiredSkills.some((rs) => rs.isMandatory), `роль ${role.id}`).toBe(true);
    }
  });
});
