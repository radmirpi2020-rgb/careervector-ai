import { writable } from 'svelte/store';
import type { ProficiencyLevel, PsychologicalVector, UserProfileState } from '../types';
import { ROLES, ROLE_BY_ID } from '../data/roles';
import {
  DIRECTIONS, DIRECTION_BY_ID, STAGE1_QUESTIONS, STAGE2_QUESTIONS,
  anchorVector, answerFactor, stage2QuestionsFor, type DirectionQuestion
} from '../data/directions';
import { findTopMatches } from '../engine/matching';

export type View = 'start' | 'quiz' | 'skills' | 'results' | 'roadmap';
export type QuizPhase = 'stage1' | 'checkpoint' | 'stage2';

const STORAGE_KEY = 'careervector_profile_v1';

const RIASEC_KEYS = [
  'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'
] as const;

export function emptyPsychology(): PsychologicalVector {
  return {
    realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0,
    ambiguityTolerance: 0.5, peopleInteractionLoad: 0.5, autonomyPreference: 0.5
  };
}

function loadStored(): UserProfileState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfileState;
    if (!parsed.psychology || !Array.isArray(parsed.skills)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const view = writable<View>('start');
export const quizAnswers = writable<Record<string, string>>({});
export const quizIndex = writable(0);
export const quizPhase = writable<QuizPhase>('stage1');
export const selectedDirection = writable<string>('dev');
export const selectedSkills = writable<Record<string, ProficiencyLevel>>({});
export const weeklyHours = writable(8);
export const currentRole = writable('');
export const currentSalary = writable('');
export const profile = writable<UserProfileState | null>(loadStored());
export const selectedRoleId = writable('');

export const stage1Total = STAGE1_QUESTIONS.length;

function phaseSync(): QuizPhase {
  let p: QuizPhase = 'stage1';
  quizPhase.subscribe((v) => (p = v))();
  return p;
}

function indexSync(): number {
  let i = 0;
  quizIndex.subscribe((v) => (i = v))();
  return i;
}

function directionSync(): string {
  let d = 'dev';
  selectedDirection.subscribe((v) => (d = v))();
  return d;
}

function answersSync(): Record<string, string> {
  let a: Record<string, string> = {};
  quizAnswers.subscribe((v) => (a = v))();
  return a;
}

export function getQuestion(index: number): DirectionQuestion {
  return phaseSync() === 'stage2'
    ? stage2QuestionsFor(directionSync())[index]
    : STAGE1_QUESTIONS[index];
}

export function currentStageSize(): number {
  return phaseSync() === 'stage2' ? stage2QuestionsFor(directionSync()).length : STAGE1_QUESTIONS.length;
}

// ===================== ТЕСТ 1: НАПРАВЛЕНИЯ =====================

export function computeDirectionScores(answers: Record<string, string>): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const d of DIRECTIONS) scores[d.id] = 0;
  for (const q of STAGE1_QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const f = answerFactor(optionId);
    if (f === 0) continue;
    for (const e of Object.entries(q.weights)) {
      const [dirId, w] = e as [string, number];
      scores[dirId] = (scores[dirId] ?? 0) + w * f;
    }
  }
  return scores;
}

export function topDirections(answers: Record<string, string>, n = 3): { id: string; title: string; tagline: string; score: number }[] {
  const scores = computeDirectionScores(answers);
  return Object.entries(scores)
    .map(([id, score]) => {
      const d = DIRECTION_BY_ID[id];
      return { id, title: d.title, tagline: d.tagline, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

// ===================== ПСИХОЛОГИЧЕСКИЙ ВЕКТОР =====================

export function computePsychology(answers: Record<string, string>): PsychologicalVector {
  const scores = computeDirectionScores(answers);
  const weighted = DIRECTIONS
    .map((d) => ({ d, w: Math.max(0, scores[d.id] ?? 0) }))
    .filter((x) => x.w > 0);

  const p = emptyPsychology();
  if (weighted.length === 0) {
    for (const d of DIRECTIONS) {
      const a = anchorVector(d.id);
      for (const k of RIASEC_KEYS) p[k] += a[k] / DIRECTIONS.length;
    }
  } else {
    const sum = weighted.reduce((acc, x) => acc + x.w, 0);
    for (const x of weighted) {
      const w = x.w as number;
      const a = anchorVector(x.d.id);
      for (const k of RIASEC_KEYS) p[k] += (a[k] * w) / sum;
    }
  }

  for (const dirId of Object.keys(STAGE2_QUESTIONS)) {
    for (const q of STAGE2_QUESTIONS[dirId]) {
      const optionId = answers[q.id];
      if (!optionId || !q.riasec) continue;
      const f = answerFactor(optionId);
      if (f === 0) continue;
      for (const k of RIASEC_KEYS) {
        const d = q.riasec[k];
        if (d) p[k] = Math.max(0, Math.min(1, p[k] + d * f * 0.06));
      }
    }
  }

  return p;
}

// ===================== ТЕСТ 2: БУСТ СПЕЦИАЛИЗАЦИЙ =====================

export function computeRoleBoost(answers: Record<string, string>): Record<string, number> {
  const boost: Record<string, number> = {};
  for (const dirId of Object.keys(STAGE2_QUESTIONS)) {
    const dir = DIRECTION_BY_ID[dirId];
    for (const q of STAGE2_QUESTIONS[dirId]) {
      const optionId = answers[q.id];
      if (!optionId) continue;
      const f = answerFactor(optionId);
      if (f === 0) continue;
      for (const e of Object.entries(q.weights)) {
        const [groupKey, w] = e as [string, number];
        const group = dir.groups.find((g) => g.key === groupKey);
        if (!group) continue;
        const val = w * f * 0.1;
        for (const roleId of group.roleIds) boost[roleId] = (boost[roleId] ?? 0) + val;
      }
    }
  }
  return boost;
}

// ===================== НАВИГАЦИЯ ПО ТЕСТУ =====================

export function startAudit() {
  quizAnswers.set({});
  quizIndex.set(0);
  quizPhase.set('stage1');
  selectedDirection.set('dev');
  view.set('quiz');
}

export function answerCurrent(optionId: string) {
  const phase = phaseSync();
  const idx = indexSync();
  const q = getQuestion(idx);
  if (!q) return;
  quizAnswers.update((a) => {
    a[q.id] = optionId;
    return a;
  });
  if (phase === 'stage1') {
    if (idx < STAGE1_QUESTIONS.length - 1) quizIndex.set(idx + 1);
    else quizPhase.set('checkpoint');
  } else {
    const size = stage2QuestionsFor(directionSync()).length;
    if (idx < size - 1) quizIndex.set(idx + 1);
    else view.set('skills');
  }
}

export function confirmDirection(directionId: string) {
  selectedDirection.set(directionId);
  quizIndex.set(0);
  quizPhase.set('stage2');
}

export function backQuestion() {
  const phase = phaseSync();
  const idx = indexSync();
  if (phase === 'stage2') {
    if (idx > 0) quizIndex.set(idx - 1);
    else quizPhase.set('checkpoint');
  } else if (phase === 'checkpoint') {
    quizPhase.set('stage1');
    quizIndex.set(STAGE1_QUESTIONS.length - 1);
  } else if (idx > 0) {
    quizIndex.set(idx - 1);
  }
}

export function restartStage1() {
  const answers = answersSync();
  for (const q of STAGE1_QUESTIONS) delete answers[q.id];
  quizAnswers.set({ ...answers });
  quizIndex.set(0);
  quizPhase.set('stage1');
}

// ===================== НАВЫКИ =====================

export function toggleSkill(id: string) {
  selectedSkills.update((sel) => {
    if (sel[id]) delete sel[id];
    else sel[id] = 3;
    return { ...sel };
  });
}

export function adjustSkillLevel(id: string, delta: number) {
  selectedSkills.update((sel) => {
    const cur = sel[id] ?? 3;
    sel[id] = Math.max(1, Math.min(5, cur + delta)) as ProficiencyLevel;
    return { ...sel };
  });
}

export function setWeeklyHours(h: number) {
  weeklyHours.set(Math.max(2, Math.min(20, Math.round(h))));
}

export function setCurrentSalary(v: string) {
  currentSalary.set(v);
}

export function setView(v: View) {
  view.set(v);
}

// ===================== ЗАВЕРШЕНИЕ =====================

function persist(state: UserProfileState | null) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage недоступен — работаем в памяти
  }
}

export function completeAudit(): UserProfileState {
  const answers = answersSync();
  let sel: Record<string, ProficiencyLevel> = {};
  selectedSkills.subscribe((s) => (sel = s))();
  let sal = '';
  currentSalary.subscribe((s) => (sal = s))();
  let role = '';
  currentRole.subscribe((r) => (role = r))();
  let hours = 8;
  weeklyHours.subscribe((h) => (hours = h))();

  const psychology = computePsychology(answers);
  const skills = Object.entries(sel).map(([skillId, level]) => ({
    skillId,
    level,
    confidenceScore: 0.7
  }));
  const base = {
    psychology,
    skills,
    currentSalaryRub: sal && Number(sal) > 0 ? Number(sal) : undefined,
    currentRole: role.trim() || undefined,
    weeklyLearningHours: hours
  };

  const matches = findTopMatches(base, ROLES, 5, computeRoleBoost(answers));
  const state: UserProfileState = {
    id: `profile_${Date.now()}`,
    ...base,
    topMatches: matches,
    savedRoadmapRoleIds: [],
    completedRoadmapStepIds: [],
    completedAt: new Date().toISOString()
  };
  profile.set(state);
  selectedRoleId.set(matches[0]?.roleId ?? '');
  persist(state);
  view.set('results');
  return state;
}

export function selectRole(roleId: string) {
  selectedRoleId.set(roleId);
  view.set('roadmap');
}

export function toggleSaveRole(roleId: string) {
  profile.update((p) => {
    if (!p) return p;
    const idx = p.savedRoadmapRoleIds.indexOf(roleId);
    if (idx >= 0) p.savedRoadmapRoleIds.splice(idx, 1);
    else p.savedRoadmapRoleIds.push(roleId);
    persist(p);
    return p;
  });
}

export function toggleCompletedStep(stepKey: string) {
  profile.update((p) => {
    if (!p) return p;
    const idx = p.completedRoadmapStepIds.indexOf(stepKey);
    if (idx >= 0) p.completedRoadmapStepIds.splice(idx, 1);
    else p.completedRoadmapStepIds.push(stepKey);
    persist(p);
    return p;
  });
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  profile.set(null);
  quizAnswers.set({});
  selectedSkills.set({});
  weeklyHours.set(8);
  currentRole.set('');
  currentSalary.set('');
  selectedRoleId.set('');
  quizIndex.set(0);
  quizPhase.set('stage1');
  view.set('start');
}

export function getRole(roleId: string) {
  return ROLE_BY_ID[roleId];
}

export { ROLE_BY_ID };