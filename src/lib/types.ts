export type CognitiveDomain =
  | 'ANALYTICAL'
  | 'CREATIVE'
  | 'SYSTEMIC'
  | 'SOCIAL_EMPATHIC'
  | 'OPERATIONAL_EXECUTION';

export type SkillType = 'HARD' | 'SOFT' | 'DOMAIN_KNOWLEDGE' | 'TOOL';

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface SkillNode {
  id: string;
  name: string;
  type: SkillType;
  category: string;
  marketDemandScore: number;
  averageTimeToLearnHours: number;
}

export interface UserSkillAssessment {
  skillId: string;
  level: ProficiencyLevel;
  confidenceScore: number;
  lastUsedYear?: number;
}

export interface PsychologicalVector {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  ambiguityTolerance: number;
  peopleInteractionLoad: number;
  autonomyPreference: number;
}

export interface RequiredSkill {
  skillId: string;
  minLevel: ProficiencyLevel;
  isMandatory: boolean;
}

export interface CareerRoleTarget {
  id: string;
  title: string;
  industry: string;
  description: string;
  medianSalaryRub: number;
  marketGrowthTrendPercent: number;
  requiredPsychology: PsychologicalVector;
  requiredSkills: RequiredSkill[];
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'ARTICLE' | 'COURSE' | 'REPO' | 'DOCS';
}

export interface TransitionRoadmapStep {
  stepIndex: number;
  title: string;
  targetSkillIds: string[];
  estimatedWeeks: number;
  freeResourceLinks: ResourceLink[];
  practiceMilestoneProject: string;
}

export interface MatchAnalysisResult {
  roleId: string;
  roleTitle: string;
  overallMatchScorePercent: number;
  psychologicalFitPercent: number;
  skillOverlapPercent: number;
  estimatedTransitionMonths: number;
  salaryChangeMultiplier: number;
  missingCriticalSkills: SkillNode[];
  transferableSkills: SkillNode[];
  roadmap: TransitionRoadmapStep[];
  isPsychOnlyFallback: boolean;
}

export interface UserProfileState {
  id: string;
  currentRole?: string;
  currentSalaryRub?: number;
  weeklyLearningHours: number;
  psychology: PsychologicalVector;
  skills: UserSkillAssessment[];
  topMatches: MatchAnalysisResult[];
  savedRoadmapRoleIds: string[];
  completedRoadmapStepIds: string[];
  completedAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
  riasec: Partial<Pick<PsychologicalVector, 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional'>>;
  prefs?: Partial<Pick<PsychologicalVector, 'ambiguityTolerance' | 'peopleInteractionLoad' | 'autonomyPreference'>>;
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  context?: string;
  options: QuizOption[];
}
