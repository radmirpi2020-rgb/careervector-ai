import type { MatchAnalysisResult, UserProfileState } from './types';
import { psychotypeCode } from './engine/matching';

export interface CareerReport {
  generatedAt: string;
  psychotype: string;
  psychology: Record<string, number>;
  profile: Pick<UserProfileState, 'currentRole' | 'currentSalaryRub' | 'weeklyLearningHours'>;
  topMatches: MatchAnalysisResult[];
  savedRoadmapRoleIds: string[];
  completedRoadmapStepIds: string[];
}

export function buildReport(p: UserProfileState, matches: MatchAnalysisResult[]): CareerReport {
  return {
    generatedAt: new Date().toISOString(),
    psychotype: psychotypeCode(p.psychology),
    psychology: { ...p.psychology },
    profile: {
      currentRole: p.currentRole,
      currentSalaryRub: p.currentSalaryRub,
      weeklyLearningHours: p.weeklyLearningHours
    },
    topMatches: matches,
    savedRoadmapRoleIds: p.savedRoadmapRoleIds,
    completedRoadmapStepIds: p.completedRoadmapStepIds
  };
}

function reportMarkdown(p: UserProfileState, report: CareerReport): string {
  const lines: string[] = [];
  lines.push('# CareerVector AI — отчёт об аудите карьеры');
  lines.push('');
  lines.push(`Дата: ${new Date(report.generatedAt).toLocaleString('ru-RU')}`);
  lines.push(`Психотип: ${report.psychotype}`);
  if (report.profile.currentRole) lines.push(`Текущая роль: ${report.profile.currentRole}`);
  if (report.profile.currentSalaryRub) lines.push(`Текущий доход: ${new Intl.NumberFormat('ru-RU').format(report.profile.currentSalaryRub)} ₽`);
  lines.push(`Готовность к обучению: ${report.profile.weeklyLearningHours} ч/нед`);
  lines.push('');
  lines.push('## Топ траекторий');
  report.topMatches.forEach((m, i) => {
    lines.push(`${i + 1}. **${m.roleTitle}** — ${m.overallMatchScorePercent}% совпадение (психотип ${m.psychologicalFitPercent}%, скиллы ${m.skillOverlapPercent}%), переход ~${m.estimatedTransitionMonths} мес`);
    for (const s of m.missingCriticalSkills) lines.push(`   - [ ] ${s.name}${s.averageTimeToLearnHours ? ` (~${s.averageTimeToLearnHours} ч)` : ''}`);
  });
  return lines.join('\n');
}

export function downloadReport(p: UserProfileState, matches: MatchAnalysisResult[], format: 'json' | 'md' = 'json'): void {
  const report = buildReport(p, matches);
  const content = format === 'json' ? JSON.stringify(report, null, 2) : reportMarkdown(p, report);
  const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `careervector-report-${date}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
