<script lang="ts">
  import { ArrowLeft, BookOpen, CheckSquare, Download, ExternalLink, GraduationCap, Square, Wrench } from '@lucide/svelte';
  import type { ResourceLink } from '$lib/types';
  import { getRole, profile, selectedRoleId, setView, toggleCompletedStep, toggleSaveRole } from '$lib/stores/profile';
  import { psychotypeCode } from '$lib/engine/matching';

  const role = $derived(getRole($selectedRoleId));
  const match = $derived($profile?.topMatches.find((m) => m.roleId === $selectedRoleId));

  const stepKeys = $derived.by(() => {
    if (!match) return [];
    return match.roadmap.map((s) => `${$selectedRoleId}::${s.stepIndex}`);
  });

  function isDone(key: string): boolean {
    return $profile?.completedRoadmapStepIds.includes(key) ?? false;
  }

  function totalHours(): number {
    if (!match) return 0;
    return match.roadmap.reduce((acc, s) => acc + s.estimatedWeeks * ($profile?.weeklyLearningHours ?? 8) * 4, 0);
  }

  function typeLabel(t: ResourceLink['type']): string {
    return { ARTICLE: 'Статья', COURSE: 'Курс', REPO: 'Репозиторий', DOCS: 'Документация' }[t] ?? t;
  }

  function exportMarkdown() {
    if (!$profile || !match || !role) return;
    const fmt = new Intl.NumberFormat('ru-RU');
    const lines: string[] = [];
    lines.push(`# Карьерный роадмап: ${role.title}`);
    lines.push('');
    lines.push(`- Психотип: ${psychotypeCode($profile.psychology)}`);
    lines.push(`- Общее совпадение: ${match.overallMatchScorePercent}%`);
    lines.push(`- Медианная зарплата на рынке: ${fmt.format(role.medianSalaryRub)} ₽`);
    lines.push(`- Рост спроса: +${role.marketGrowthTrendPercent}% г/г`);
    lines.push(`- Ориентировочный срок перехода: ${match.estimatedTransitionMonths} мес при ${$profile.weeklyLearningHours} ч/нед`);
    lines.push('');
    lines.push('## Требуется закрыть скилл-гэп');
    lines.push('');
    for (const s of match.roadmap) {
      const done = isDone(`${role.id}::${s.stepIndex}`);
      lines.push(`### Этап ${s.stepIndex}${done ? ' [выполнен]' : ''}: ${s.title} (~${s.estimatedWeeks} нед)`);
      lines.push('');
      for (const id of s.targetSkillIds) {
        lines.push(`- [ ] навык: ${id}`);
      }
      lines.push('');
      lines.push(`Практический артефакт: ${s.practiceMilestoneProject}`);
      lines.push('');
      lines.push('Материалы:');
      for (const r of s.freeResourceLinks) {
        lines.push(`- (${typeLabel(r.type)}) [${r.title}](${r.url})`);
      }
      lines.push('');
    }
    lines.push('---');
    lines.push('Сгенерировано CareerVector AI — все данные хранятся локально.');
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careervector-${role.id}-roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

{#if !role || !match || !$profile}
  <div class="mx-auto max-w-md px-4 py-20 text-center">
    <p class="text-slate-400">Роль не выбрана.</p>
    <button onclick={() => setView('results')} class="mt-4 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
      К результатам
    </button>
  </div>
{:else}
  <div class="mx-auto max-w-3xl px-4 pb-20 pt-8">
    <button
      onclick={() => setView('results')}
      class="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
    >
      <ArrowLeft class="h-4 w-4" />
      К результатам
    </button>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-xs font-medium uppercase tracking-wider text-indigo-400">90-дневный план перехода</div>
          <h1 class="mt-1 text-2xl font-bold text-slate-50">{role.title}</h1>
          <p class="mt-2 text-sm text-slate-400">
            Смежность {match.overallMatchScorePercent}% · переход ~{match.estimatedTransitionMonths} мес ·
            {new Intl.NumberFormat('ru-RU').format(role.medianSalaryRub)} ₽ медиана
          </p>
        </div>
        <button
          onclick={() => toggleSaveRole(role.id)}
          class="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
        >
          {$profile.savedRoadmapRoleIds.includes(role.id) ? 'Трек сохранён ✓' : 'Сохранить трек'}
        </button>
      </div>

      <div class="mt-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-sm text-slate-400">
        <p class="flex items-start gap-2">
          <GraduationCap class="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            Итого ориентировочно: <span class="font-semibold text-slate-200">{Math.round(totalHours())} ч</span> чистого
            времени обучения при {$profile.weeklyLearningHours} ч/нед. Реалистичный расчёт по эмпирическим
            трудозатратам: освоение нового стека с нуля — не менее 600–800 часов.
          </span>
        </p>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-4">
      {#each match.roadmap as step (step.stepIndex)}
        {@const done = isDone(`${role.id}::${step.stepIndex}`)}
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <button
                onclick={() => toggleCompletedStep(`${role.id}::${step.stepIndex}`)}
                class="mt-0.5 shrink-0 text-indigo-400 transition hover:text-indigo-300"
                aria-label="Отметить этап"
              >
                {#if done}
                  <CheckSquare class="h-6 w-6" />
                {:else}
                  <Square class="h-6 w-6" />
                {/if}
              </button>
              <div>
                <h2 class="flex flex-wrap items-center gap-2 text-base font-semibold text-slate-100">
                  Этап {step.stepIndex}: {step.title}
                  {#if done}
                    <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">выполнен</span>
                  {/if}
                </h2>
                <p class="mt-1 text-xs text-slate-500">
                  Срок: ~{step.estimatedWeeks} нед · навыки: {step.targetSkillIds.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <h3 class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Wrench class="h-3.5 w-3.5" />
              Практический артефакт
            </h3>
            <p class="text-sm leading-relaxed text-slate-300">{step.practiceMilestoneProject}</p>
          </div>

          <div class="mt-3">
            <h3 class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <BookOpen class="h-3.5 w-3.5" />
              Бесплатные материалы
            </h3>
            <div class="flex flex-col gap-1.5">
              {#each step.freeResourceLinks as r}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                  <span class="shrink-0 rounded bg-slate-700/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                    {typeLabel(r.type)}
                  </span>
                  <span class="flex-1 leading-snug">{r.title}</span>
                  <ExternalLink class="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-indigo-400" />
                </a>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <button
        onclick={exportMarkdown}
        class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
      >
        <Download class="h-4 w-4" />
        Экспорт роадмапа (Markdown)
      </button>
      <button
        onclick={() => setView('results')}
        class="rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
      >
        Другие траектории
      </button>
    </div>
  </div>
{/if}
