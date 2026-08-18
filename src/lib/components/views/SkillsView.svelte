<script lang="ts">
  import { Check, ChevronDown, Minus, Plus, Search, X, Calculator, BrainCircuit } from '@lucide/svelte';
  import { SKILL_LIST } from '$lib/data/skills';
  import { ROLES } from '$lib/data/roles';
  import { DIRECTION_BY_ID, directionOfRole } from '$lib/data/directions';
  import {
    adjustSkillLevel, completeAudit, currentSalary, selectedDirection, selectedSkills,
    setCurrentSalary, setWeeklyHours, toggleSkill, weeklyHours
  } from '$lib/stores/profile';

  const dirId = $derived($selectedDirection);
  const dirTitle = $derived(DIRECTION_BY_ID[dirId]?.title ?? '');

  const relevantIds = $derived.by(() => {
    const ids = new Set<string>();
    for (const r of ROLES) {
      if (directionOfRole(r.id) === dirId) {
        for (const s of r.requiredSkills) ids.add(s.skillId);
      }
    }
    return ids;
  });

  let showAll = $state(false);
  let filter = $state('');
  let collapsed = $state<Record<string, boolean>>({});

  const totalCount = SKILL_LIST.length;

  const categories = $derived.by(() => {
    const q = filter.trim().toLowerCase();
    const list = q
      ? SKILL_LIST.filter((s) => s.name.toLowerCase().includes(q))
      : showAll
        ? SKILL_LIST
        : SKILL_LIST.filter((s) => relevantIds.has(s.id));
    const map = new Map<string, typeof SKILL_LIST>();
    for (const s of list) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return Array.from(map.entries())
      .map(([name, skills]) => ({
        name,
        skills,
        relevant: skills.some((s) => relevantIds.has(s.id))
      }))
      .sort((a, b) => Number(b.relevant) - Number(a.relevant));
  });

  const visibleCount = $derived(categories.reduce((acc, c) => acc + c.skills.length, 0));
  const relevantCount = $derived(relevantIds.size);
  const selectedCount = $derived(Object.keys($selectedSkills).length);

  function toggleCat(name: string) {
    collapsed = { ...collapsed, [name]: !(collapsed[name] ?? false) };
  }

  function toggleShowAll() {
    showAll = !showAll;
    collapsed = {};
  }
</script>

<div class="mx-auto max-w-3xl px-4 pb-20 pt-8">
  <div class="mb-6 text-center">
    <h1 class="text-2xl font-bold text-slate-50">Какие навыки у вас уже есть?</h1>
    <p class="mx-auto mt-2 max-w-xl text-sm text-slate-400">
      Отметьте, что реально применяли в работе за последние годы.
      Уровень можно поправить. Точность матчинга вырастет — можно пропустить.
    </p>
  </div>

  <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="text"
        placeholder="Поиск навыка…"
        value={filter}
        oninput={(e) => (filter = e.currentTarget.value)}
        class="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-2.5 pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
      />
    </div>
    <button
      onclick={toggleShowAll}
      class="shrink-0 rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
    >
      {showAll ? 'Только для направления «{dirTitle}»' : 'Показать все категории'}
    </button>
  </div>

  {#if !filter}
    <p class="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
      <span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 font-medium text-indigo-300">
        {dirTitle}
      </span>
      показаны навыки, важные для вашего направления ({visibleCount} из {totalCount} в каталоге)
    </p>
  {/if}

  {#if categories.length === 0}
    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-500">
      Ничего не найдено по запросу «{filter}».
    </div>
  {/if}

  <div class="flex flex-col gap-4">
    {#each categories as cat}
      {@const isCollapsed = collapsed[cat.name] ?? !(filter || showAll ? true : cat.relevant)}
      <div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <button
          onclick={() => toggleCat(cat.name)}
          class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-800/50"
        >
          <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {cat.name}
            <span class="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500">{cat.skills.length}</span>
          </span>
          <ChevronDown class="h-4 w-4 shrink-0 text-slate-500 transition-transform {isCollapsed ? '' : 'rotate-180'}" />
        </button>
        {#if !isCollapsed}
          <div class="flex flex-wrap gap-2 border-t border-slate-800/70 p-4">
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
        {/if}
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