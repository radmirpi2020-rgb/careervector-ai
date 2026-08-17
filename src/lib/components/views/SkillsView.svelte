<script lang="ts">
  import { Check, Minus, Plus, X, Calculator, BrainCircuit } from '@lucide/svelte';
  import { SKILL_LIST } from '$lib/data/skills';
  import {
    adjustSkillLevel, completeAudit, currentSalary, selectedSkills,
    setCurrentSalary, setWeeklyHours, toggleSkill, weeklyHours
  } from '$lib/stores/profile';

  const categories = $derived.by(() => {
    const map = new Map<string, typeof SKILL_LIST>();
    for (const s of SKILL_LIST) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return Array.from(map.entries()).map(([name, skills]) => ({ name, skills }));
  });

  const selectedCount = $derived(Object.keys($selectedSkills).length);
</script>

<div class="mx-auto max-w-3xl px-4 pb-20 pt-8">
  <div class="mb-8 text-center">
    <h1 class="text-2xl font-bold text-slate-50">Какие навыки у вас уже есть?</h1>
    <p class="mx-auto mt-2 max-w-xl text-sm text-slate-400">
      Отметьте, что реально применяли в работе за последние годы. Уровень можно поправить.
      Это существенно повысит точность матчинга (можно пропустить).
    </p>
  </div>

  <div class="flex flex-col gap-6">
    {#each categories as cat}
      <div>
        <h2 class="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{cat.name}</h2>
        <div class="flex flex-wrap gap-2">
          {#each cat.skills as skill}
            <button
              onclick={() => toggleSkill(skill.id)}
              class={$selectedSkills[skill.id]
                ? 'inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/60 bg-indigo-500/15 px-3 py-1.5 text-xs text-indigo-200 transition'
                : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-600'}
            >
              {#if $selectedSkills[skill.id]}
                <Check class="h-3 w-3 text-indigo-400" />
              {/if}
              {skill.name}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if selectedCount > 0}
    <div class="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <BrainCircuit class="h-4 w-4 text-indigo-400" />
        Выбранные навыки ({selectedCount}) — укажите уровень владения
      </h2>
      <div class="flex flex-col gap-2">
        {#each Object.entries($selectedSkills) as [id, level]}
          <div class="flex items-center justify-between gap-3 rounded-lg bg-slate-800/60 px-3 py-2">
            <span class="text-sm text-slate-200">{SKILL_LIST.find((s) => s.id === id)?.name ?? id}</span>
            <div class="flex items-center gap-2">
              <button onclick={() => adjustSkillLevel(id, -1)} class="rounded-md bg-slate-700 p-1.5 transition hover:bg-slate-600" aria-label="Понизить уровень">
                <Minus class="h-3.5 w-3.5 text-slate-300" />
              </button>
              <div class="flex gap-1">
                {#each [1, 2, 3, 4, 5] as lvl}
                  <span
                    class="h-2 w-3 rounded-sm transition"
                    class:bg-indigo-400={level >= lvl}
                    class:bg-slate-700={level < lvl}
                  ></span>
                {/each}
              </div>
              <button onclick={() => adjustSkillLevel(id, 1)} class="rounded-md bg-slate-700 p-1.5 transition hover:bg-slate-600" aria-label="Повысить уровень">
                <Plus class="h-3.5 w-3.5 text-slate-300" />
              </button>
              <button onclick={() => toggleSkill(id)} class="ml-1 rounded-md bg-slate-700/60 p-1.5 transition hover:bg-rose-500/30" aria-label="Убрать навык">
                <X class="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:grid-cols-2">
    <div>
      <label for="weekly-hours" class="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
        <span>Готовность к обучению</span>
        <span class="text-indigo-300">{$weeklyHours} ч/нед</span>
      </label>
      <input id="weekly-hours" type="range" min="2" max="20" step="1" value={$weeklyHours} oninput={(e) => setWeeklyHours(Number(e.currentTarget.value))} class="w-full accent-indigo-500" />
      <p class="mt-1 text-xs text-slate-600">Влияет на расчёт сроков перехода в роадмапе</p>
    </div>
    <div>
      <label for="current-salary" class="mb-2 block text-xs font-medium text-slate-400">Текущий доход (₽/мес, опционально)</label>
      <input
        id="current-salary"
        type="number"
        min="0"
        placeholder="например, 160000"
        value={$currentSalary}
        oninput={(e) => setCurrentSalary(e.currentTarget.value)}
        class="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
      />
    </div>
  </div>

  <div class="mt-8 flex flex-col gap-3 sm:flex-row">
    <button
      onclick={() => completeAudit()}
      class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
    >
      <Calculator class="h-4 w-4" />
      Рассчитать мои траектории
    </button>
    <button
      onclick={() => completeAudit()}
      class="rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
    >
      Пропустить этот шаг
    </button>
  </div>
</div>
