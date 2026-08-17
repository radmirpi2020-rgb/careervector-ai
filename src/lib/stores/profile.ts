import { writable } from 'svelte/store';
import type { ProficiencyLevel, PsychologicalVector, UserProfileState } from '../types';
import { QUESTIONS } from '../data/questions';
import { ROLES, ROLE_BY_ID } from '../data/roles';
import { findTopMatches } from '../engine/matching';

export type View = 'start' | 'quiz' | 'skills' | 'results' | 'roadmap';

const STORAGE_KEY = 'careervector_profile_v1';
const MAX_RIASEC = 24;

const RIASEC_KEYS = [
  'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'
] as const;

const PREFS_KEYS = [
  'ambiguityTolerance', 'peopleInteractionLoad', 'autonomyPreference'
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
export const selectedSkills = writable<Record<string, ProficiencyLevel>>({});
export const weeklyHours = writable(8);
export const currentRole = writable('');
export const currentSalary = writable('');
export const profile = writable<UserProfileState | null>(loadStored());
export const selectedRoleId = writable('');

export const totalQuestions = QUESTIONS.length;

export function getQuestion(index: number) {
  return QUESTIONS[index];
}

function computePsychology(answers: Record<string, string>): PsychologicalVector {
  const p = emptyPsychology();
  const prefs: Record<string, number> = { ambiguityTolerance: 0, peopleInteractionLoad: 0, autonomyPreference: 0 };
  let prefCount = 0;
  for (const q of QUESTIONS) {
    const optionId = answers[q.id];
    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) continue;
    for (const k of RIASEC_KEYS) p[k] += opt.riasec[k] ?? 0;
    if (opt.prefs) {
      for (const k of PREFS_KEYS) {
        const d = opt.prefs[k];
        if (d) {
          prefs[k] += d;
          prefCount++;
        }
      }
    }
  }
  for (const k of RIASEC_KEYS) p[k] = Math.min(1, p[k] / MAX_RIASEC);
  for (const k of PREFS_KEYS) {
    p[k] = Math.max(0, Math.min(1, 0.5 + (prefCount > 0 ? prefs[k] / Math.max(1, prefCount / 3) : 0)));
  }
  return p;
}

function persist(state: UserProfileState | null) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage недоступен — работаем в памяти
  }
}

export function startAudit() {
  quizAnswers.set({});
  quizIndex.set(0);
  view.set('quiz');
}

export function answerCurrent(optionId: string) {
  quizAnswers.update((a) => {
    const q = QUESTIONS[quizIndexSync()];
    a[q.id] = optionId;
    return a;
  });
  const idx = quizIndexSync();
  if (idx < QUESTIONS.length - 1) quizIndex.set(idx + 1);
  else view.set('skills');
}

function quizIndexSync(): number {
  let idx = 0;
  quizIndex.subscribe((v) => (idx = v))();
  return idx;
}

export function backQuestion() {
  quizIndex.update((i) => Math.max(0, i - 1));
}

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

export function completeAudit(): UserProfileState {
  let answers: Record<string, string> = {};
  quizAnswers.subscribe((a) => (answers = a))();
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
  const matches = findTopMatches(base, ROLES, 5);
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
  view.set('start');
}

export function getRole(roleId: string) {
  return ROLE_BY_ID[roleId];
}
