import type {
  CareerRoleTarget,
  MatchAnalysisResult,
  ProficiencyLevel,
  PsychologicalVector,
  SkillNode,
  TransitionRoadmapStep,
  UserProfileState,
  UserSkillAssessment
} from '../types';
import { SKILLS } from '../data/skills';
import { resourcesForSkill } from '../data/resources';

const SIGMA = 0.45;
const LAMBDA = 0.0012;
const GAMMA = 0.25;
const HOURS_PER_MONTH = 4.33;

const RIASEC_KEYS: (keyof PsychologicalVector)[] = [
  'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'
];

export function normalizePsychology(p: PsychologicalVector): PsychologicalVector {
  const norm = Math.sqrt(RIASEC_KEYS.reduce((acc, k) => acc + p[k] * p[k], 0)) || 1;
  const q: PsychologicalVector = { ...p };
  for (const k of RIASEC_KEYS) q[k] = p[k] / norm;
  return q;
}

export function psychologicalFit(user: PsychologicalVector, role: PsychologicalVector): number {
  const u = normalizePsychology(user);
  const r = normalizePsychology(role);
  let distSq = 0;
  for (const k of RIASEC_KEYS) distSq += (u[k] - r[k]) * (u[k] - r[k]);
  return Math.exp(-distSq / (2 * SIGMA * SIGMA));
}

export function skillOwnership(userLevel: ProficiencyLevel | undefined, reqLevel: ProficiencyLevel): number {
  if (!userLevel) return 0;
  if (userLevel >= reqLevel) return 1;
  return userLevel / reqLevel;
}

export interface SkillMatchDetail {
  skill: SkillNode;
  requiredLevel: ProficiencyLevel;
  isMandatory: boolean;
  userLevel: ProficiencyLevel | undefined;
  ownership: number;
  weight: number;
  isGap: boolean;
}

export function skillOverlap(role: CareerRoleTarget, userSkills: UserSkillAssessment[]): {
  matchScore: number;
  details: SkillMatchDetail[];
  missingHours: number;
} {
  const levelById = new Map(userSkills.map((s) => [s.skillId, s.level]));
  const rawWeights = role.requiredSkills.map((rs) => {
    const skill = SKILLS[rs.skillId];
    return (rs.isMandatory ? 2 : 1) * (skill?.marketDemandScore ?? 0.5);
  });
  const totalWeight = rawWeights.reduce((a, b) => a + b, 0) || 1;

  let weightedSum = 0;
  let mandatoryBlocked = false;
  let missingHours = 0;
  const details: SkillMatchDetail[] = role.requiredSkills.map((rs, i) => {
    const skill = SKILLS[rs.skillId];
    const userLevel = levelById.get(rs.skillId);
    const ownership = skillOwnership(userLevel, rs.minLevel);
    const weight = rawWeights[i] / totalWeight;
    weightedSum += weight * ownership;
    if (rs.isMandatory && ownership < 0.5) mandatoryBlocked = true;
    const gapHours = skill ? skill.averageTimeToLearnHours * Math.max(0, 1 - ownership) : 0;
    missingHours += gapHours;
    return {
      skill,
      requiredLevel: rs.minLevel,
      isMandatory: rs.isMandatory,
      userLevel,
      ownership,
      weight,
      isGap: ownership < 0.5 || (rs.isMandatory && ownership < 1)
    };
  });

  const matchScore = mandatoryBlocked ? 0 : weightedSum;
  return { matchScore, details, missingHours };
}

export function transitionFeasibilityIndex(
  matchSkill: number,
  fitPsych: number,
  missingHours: number,
  salaryRole: number,
  salaryUser: number | undefined
): number {
  const timePenalty = 1 + LAMBDA * missingHours;
  const salaryRatio = salaryUser && salaryUser > 0 ? salaryRole / salaryUser : 1;
  return (matchSkill * fitPsych) / timePenalty * Math.pow(salaryRatio, GAMMA);
}

const MILESTONES: Record<string, string> = {
  'Данные': 'Собрать исследование на открытых данных: от очистки до дашборда с выводами, опубликовать на GitHub',
  'Разработка': 'Разработать pet-приложение на целевом стеке с тестами и CI/CD, выложить в GitHub с README',
  'DevOps': 'Поднять инфраструктуру pet-проекта: IaC, CI/CD-пайплайн, мониторинг, алерты',
  'QA': 'Автоматизировать тесты существующего open-source проекта и задокументировать покрытие',
  'Продукт': 'Провести discovery реальной гипотезы: интервью → анализ → PRD → приоритизация',
  'Дизайн': 'Оформить портфолио-кейс: исследование → wireframes → дизайн → тестирование прототипа',
  'Маркетинг': 'Запустить реальный эксперимент (кампанию/контент) и измерить метрики в отчёте',
  'Софт-скиллы': 'Провести серию публичных разборов, выступлений или наставничества с зафиксированным фидбеком',
  'Домен': 'Собрать аналитический отчёт по домену (10+ страниц) с выводами и рекомендациями',
  'Инфраструктура': 'Развернуть реальный сервис на облаке: сеть, БД, деплой, мониторинг',
  'Безопасность': 'Провести аудит безопасности pet-проекта и оформить отчёт с найденными уязвимостями'
};

function buildStepTitle(ids: string[]): string {
  const names = ids.map((id) => SKILLS[id]?.name ?? id);
  return names.length <= 3 ? names.join(', ') : `${names.slice(0, 2).join(', ')} и ещё ${names.length - 2}`;
}

export function buildRoadmap(role: CareerRoleTarget, profile: Pick<UserProfileState, 'weeklyLearningHours'>, details: SkillMatchDetail[]): TransitionRoadmapStep[] {
  const weekly = Math.max(2, profile.weeklyLearningHours || 8);
  const gaps = details
    .filter((d) => d.isGap)
    .sort((a, b) => {
      const av = a.isMandatory ? 2 : 1;
      const bv = b.isMandatory ? 2 : 1;
      return av !== bv ? bv - av : b.skill.averageTimeToLearnHours - a.skill.averageTimeToLearnHours;
    });

  const chunks: string[][] = [];
  let current: string[] = [];
  let currentHours = 0;
  const TARGET_HOURS = Math.max(24, weekly * 3);
  for (const g of gaps) {
    if (current.length > 0 && currentHours + g.skill.averageTimeToLearnHours > TARGET_HOURS * 1.4 && current.length >= 2) {
      chunks.push(current);
      current = [];
      currentHours = 0;
    }
    current.push(g.skill.id);
    currentHours += g.skill.averageTimeToLearnHours;
  }
  if (current.length > 0) chunks.push(current);
  if (chunks.length === 0) return [];

  return chunks.slice(0, 4).map((ids, i) => {
    const hours = ids.reduce((acc, id) => acc + (SKILLS[id]?.averageTimeToLearnHours ?? 0), 0);
    const category = SKILLS[ids[0]]?.category ?? 'Разработка';
    const resources = Array.from(new Map(ids.flatMap((id) => resourcesForSkill(id).map((r) => [r.url, r]))).values());
    return {
      stepIndex: i + 1,
      title: buildStepTitle(ids),
      targetSkillIds: ids,
      estimatedWeeks: Math.max(1, Math.round((hours / weekly) * 10) / 10),
      freeResourceLinks: resources.slice(0, 5),
      practiceMilestoneProject: MILESTONES[category] ?? `Собрать pet-проект по навыкам шага (${ids.map((id) => SKILLS[id]?.name ?? id).join(', ')}) и опубликовать результаты`
    };
  });
}

export function analyzeRole(
  role: CareerRoleTarget,
  profile: Pick<UserProfileState, 'psychology' | 'skills' | 'currentSalaryRub' | 'weeklyLearningHours'>
): MatchAnalysisResult {
  const fitPsych = psychologicalFit(profile.psychology, role.requiredPsychology);
  const { matchScore, details, missingHours } = skillOverlap(role, profile.skills);
  const tfi = transitionFeasibilityIndex(matchScore, fitPsych, missingHours, role.medianSalaryRub, profile.currentSalaryRub);

  const missingCritical = details.filter((d) => d.isGap && d.isMandatory).map((d) => d.skill);
  const transferable = details.filter((d) => !d.isGap).map((d) => d.skill);

  const weekly = Math.max(2, profile.weeklyLearningHours || 8);
  const transitionMonths = Math.max(0.5, Math.round((missingHours / weekly / HOURS_PER_MONTH) * 10) / 10);

  const overall = Math.min(99, Math.round(matchScore * fitPsych * 100));

  return {
    roleId: role.id,
    roleTitle: role.title,
    overallMatchScorePercent: overall,
    psychologicalFitPercent: Math.round(fitPsych * 100),
    skillOverlapPercent: Math.round(matchScore * 100),
    estimatedTransitionMonths: transitionMonths,
    salaryChangeMultiplier: profile.currentSalaryRub && profile.currentSalaryRub > 0
      ? Math.round((role.medianSalaryRub / profile.currentSalaryRub) * 100) / 100
      : 1,
    missingCriticalSkills: missingCritical,
    transferableSkills: transferable,
    roadmap: buildRoadmap(role, profile, details),
    isPsychOnlyFallback: false
  };
}

export function findTopMatches(
  profile: Pick<UserProfileState, 'psychology' | 'skills' | 'currentSalaryRub' | 'weeklyLearningHours'>,
  roles: CareerRoleTarget[],
  topN = 5
): MatchAnalysisResult[] {
  const withTfi = roles.map((role) => {
    const fitPsych = psychologicalFit(profile.psychology, role.requiredPsychology);
    const { matchScore, missingHours } = skillOverlap(role, profile.skills);
    const tfi = transitionFeasibilityIndex(matchScore, fitPsych, missingHours, role.medianSalaryRub, profile.currentSalaryRub);
    return { role, tfi, fitPsych, matchScore };
  });

  const eligible = withTfi.filter((x) => x.tfi > 0).sort((a, b) => b.tfi - a.tfi);
  const psychOnly = withTfi.filter((x) => x.tfi <= 0).sort((a, b) => b.fitPsych - a.fitPsych);

  const pool: (MatchAnalysisResult & { _tfi?: number })[] = eligible.map((x) => ({ ...analyzeRole(x.role, profile), _tfi: x.tfi }));
  let results = pool.sort((a, b) => (b._tfi ?? 0) - (a._tfi ?? 0)).slice(0, topN);

  if (results.length < 3) {
    const needed = 3 - results.length;
    const fallback: (MatchAnalysisResult & { _tfi?: number })[] = psychOnly.slice(0, needed).map((x) => ({ ...analyzeRole(x.role, profile), isPsychOnlyFallback: true, _tfi: -1 }));
    results = [...results, ...fallback];
  }

  return results.map((r) => ({ ...r, _tfi: undefined })).slice(0, topN) as MatchAnalysisResult[];
}

export function psychotypeCode(p: PsychologicalVector): string {
  const entries = RIASEC_KEYS.map((k) => [k, p[k]] as [keyof PsychologicalVector, number]);
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, 2).map(([k]) => k[0].toUpperCase().slice(0, 1));
  return top.join('-');
}

export function psychotypeLabel(p: PsychologicalVector): string {
  const labels: Record<string, string> = {
    R: 'Прагматик-инженер', I: 'Исследователь-аналитик', A: 'Творец-дизайнер',
    S: 'Коммуникатор-наставник', E: 'Лидер-предприниматель', C: 'Систематизатор-организатор'
  };
  const entries = RIASEC_KEYS.map((k) => [k, p[k]] as const);
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0][0].toUpperCase().slice(0, 1);
  return labels[top] ?? 'Гибкий профиль';
}
