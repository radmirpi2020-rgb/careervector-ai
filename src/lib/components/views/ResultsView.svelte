<script lang="ts">
  import { AlertTriangle, Bookmark, BookmarkCheck, ChevronRight, Download, Flame, Printer, RefreshCw, TrendingUp } from '@lucide/svelte';
  import type { MatchAnalysisResult } from '$lib/types';
  import { skillOverlap } from '$lib/engine/matching';
  import { ROLES } from '$lib/data/roles';
  import { profile, selectRole, setView, toggleSaveRole } from '$lib/stores/profile';
  import { psychotypeCode, psychotypeLabel } from '$lib/engine/matching';
  import { downloadReport } from '$lib/report';
  import Radar from '$lib/components/Radar.svelte';
  import SkillRadar from '$lib/components/SkillRadar.svelte';

  let selectedRoleId = $state('');

  const match = $derived($profile?.topMatches ?? []);
  const radarRole = $derived(ROLES.find((r) => r.id === selectedRoleId) ?? ROLES.find((r) => r.id === (match[0]?.roleId ?? '')));
  const radarDetails = $derived.by(() => {
    if (!$profile || !radarRole) return [];
    return skillOverlap(radarRole, $profile.skills).details;
  });
  const savedIds = $derived($profile?.savedRoadmapRoleIds ?? []);

  const doneSteps = $derived.by(() => {
    const byRole = new Map<string, number>();
    for (const key of $profile?.completedRoadmapStepIds ?? []) {
      const [roleId] = key.split('::');
      byRole.set(roleId, (byRole.get(roleId) ?? 0) + 1);
    }
    return byRole;
  });

  function roleSalary(m: MatchAnalysisResult): number {
    return ROLES.find((r) => r.id === m.roleId)?.medianSalaryRub ?? 0;
  }

  function salaryDiff(m: MatchAnalysisResult): number | null {
    if (!$profile?.currentSalaryRub || $profile.currentSalaryRub <= 0) return null;
    return Math.round((m.salaryChangeMultiplier - 1) * 100);
  }
</script>

{#if !$profile}
  <div class="mx-auto max-w-md px-4 py-20 text-center">
    <p class="text-slate-400">Профиль не найден. Пройдите аудит, чтобы увидеть траектории.</p>
    <button onclick={() => setView('start')} class="mt-4 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
      На главную
    </button>
  </div>
{:else}
  <div class="mx-auto max-w-6xl px-4 pb-20 pt-8">
    <div class="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-50">Ваша карта траекторий</h1>
        <p class="mt-1 text-sm text-slate-400">
          Психотип: <span class="font-semibold text-indigo-300">{psychotypeCode($profile.psychology)}</span> —
          {psychotypeLabel($profile.psychology)}
          {#if $profile.currentSalaryRub}
            · Текущий доход: {new Intl.NumberFormat('ru-RU').format($profile.currentSalaryRub)} ₽
          {/if}
          · Готовность: {$profile.weeklyLearningHours} ч/нед
        </p>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-2 print:hidden">
        <button
          onclick={() => { if ($profile) downloadReport($profile, match, 'json'); }}
          class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          <Download class="h-4 w-4" />
          Экспорт JSON
        </button>
        <button
          onclick={() => { if ($profile) downloadReport($profile, match, 'md'); }}
          class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          <Download class="h-4 w-4" />
          Экспорт MD
        </button>
        <button
          onclick={() => window.print()}
          class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          <Printer class="h-4 w-4" />
          Печать / PDF
        </button>
        <button
          onclick={() => setView('start')}
          class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          <RefreshCw class="h-4 w-4" />
          Пройти аудит заново
        </button>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div class="flex flex-col gap-4">
        {#each match as m, i (m.roleId)}
          {@const isSaved = savedIds.includes(m.roleId)}
          {@const diff = salaryDiff(m)}
          <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-indigo-500/40">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-sm font-bold text-indigo-300">
                  {i + 1}
                </div>
                <div>
                  <h3 class="flex items-center gap-2 font-semibold text-slate-50">
                    {m.roleTitle}
                    {#if m.salaryChangeMultiplier > 1.2}
                      <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                        <Flame class="h-3 w-3" />
                        рост дохода
                      </span>
                    {/if}
                  </h3>
                  <p class="mt-0.5 text-xs text-slate-500">
                    Смежность: <span class="font-semibold text-indigo-300">{m.overallMatchScorePercent}%</span>
                    {#if $profile.currentSalaryRub}
                      · Медиана рынка: {new Intl.NumberFormat('ru-RU').format(roleSalary(m))} ₽
                    {/if}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-extrabold text-indigo-300">{m.overallMatchScorePercent}%</div>
                <div class="text-[11px] text-slate-500">совпадение</div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-lg bg-slate-800/60 px-2 py-2">
                <div class="text-sm font-semibold text-slate-200">{m.psychologicalFitPercent}%</div>
                <div class="text-[11px] text-slate-500">психотип</div>
              </div>
              <div class="rounded-lg bg-slate-800/60 px-2 py-2">
                <div class="text-sm font-semibold text-slate-200">{m.skillOverlapPercent}%</div>
                <div class="text-[11px] text-slate-500">скиллы</div>
              </div>
              <div class="rounded-lg bg-slate-800/60 px-2 py-2">
                <div class="text-sm font-semibold text-slate-200">~{m.estimatedTransitionMonths} мес</div>
                <div class="text-[11px] text-slate-500">переход</div>
              </div>
            </div>

            {#if diff !== null}
              <p class="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp class="h-3.5 w-3.5 text-emerald-400" />
                {diff >= 0 ? '+' : ''}{diff}% к текущему доходу
              </p>
            {/if}

            {#if m.missingCriticalSkills.length > 0}
              <div class="mt-3">
                <div class="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-amber-400">
                  <AlertTriangle class="h-3.5 w-3.5" />
                  Скилл-гэп: критичные навыки
                </div>
                <div class="flex flex-wrap gap-1.5">
                  {#each m.missingCriticalSkills as s}
                    <span class="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">{s.name}</span>
                  {/each}
                </div>
              </div>
            {/if}

            {#if m.transferableSkills.length > 0}
              <div class="mt-2">
                <div class="mb-1.5 text-[11px] font-medium text-emerald-400">Переносимые навыки (зачтутся сразу)</div>
                <div class="flex flex-wrap gap-1.5">
                  {#each m.transferableSkills.slice(0, 6) as s}
                    <span class="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">{s.name}</span>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button
                onclick={() => selectRole(m.roleId)}
                class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                Роадмап перехода
                <ChevronRight class="h-3.5 w-3.5" />
              </button>
              <button
                onclick={() => toggleSaveRole(m.roleId)}
                class={isSaved
                  ? 'inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/50 px-4 py-2 text-xs text-indigo-300 transition hover:bg-slate-800'
                  : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-800'}
              >
                {#if isSaved}
                  <BookmarkCheck class="h-3.5 w-3.5" />
                  Сохранён
                {:else}
                  <Bookmark class="h-3.5 w-3.5" />
                  Сохранить трек
                {/if}
              </button>
            </div>

            {#if isSaved && doneSteps.get(m.roleId)}
              <p class="mt-3 text-xs text-emerald-400">
                Выполнено шагов роадмапа: {doneSteps.get(m.roleId)}
              </p>
            {/if}
          </div>
        {/each}
      </div>

      <div class="lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 class="mb-3 flex items-center justify-between gap-3 text-sm font-semibold text-slate-200">
            <span>Радары совпадения</span>
            <select
              bind:value={selectedRoleId}
              class="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              {#each match as m}
                <option value={m.roleId}>{m.roleTitle}</option>
              {/each}
            </select>
          </h2>

          {#if radarRole && $profile}
            <div class="mb-4 flex justify-center">
              <Radar user={$profile.psychology} role={radarRole.requiredPsychology} size={300} />
            </div>
            <div class="mb-4 text-center text-xs text-slate-500">Психотип vs роль</div>
            <div class="mb-4 flex justify-center">
              <SkillRadar details={radarDetails} size={300} />
            </div>
            <div class="text-center text-xs text-slate-500">Скилл-сет vs требования роли</div>

            <div class="mt-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-center">
              <div class="text-2xl font-bold text-slate-100">
                {new Intl.NumberFormat('ru-RU').format(radarRole.medianSalaryRub)} ₽
              </div>
              <div class="mt-1 text-xs text-slate-500">
                медиана рынка · рост спроса {radarRole.marketGrowthTrendPercent > 0 ? '+' : ''}{radarRole.marketGrowthTrendPercent}% г/г
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
