<script lang="ts">
  import { BookOpen, ExternalLink, GraduationCap, Info, Medal, Search, Sparkles } from '@lucide/svelte';
  import { ITMO_PROGRAMS, itmoDirections, itmoRequirements } from '$lib/data/itmo';
  import { DIRECTION_BY_ID } from '$lib/data/directions';
  import { startItmoTest } from '$lib/stores/profile';
  import { reveal } from '$lib/actions/reveal';

  const dirTitles: Record<string, string> = {
    dev: 'Разработка',
    data: 'Данные и аналитика',
    infra: 'Инженерия и инфраструктура',
    product: 'Продукт и дизайн',
    mgmt: 'Менеджмент'
  };

  let activeDir = $state('all');
  let query = $state('');

  const filtered = $derived(
    ITMO_PROGRAMS.filter((p) => {
      const okDir = activeDir === 'all' || p.directionId === activeDir;
      const q = query.trim().toLowerCase();
      const okQuery = !q || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      return okDir && okQuery;
    })
  );

  const groups = $derived.by(() => {
    const map = new Map<string, typeof ITMO_PROGRAMS>();
    for (const p of filtered) {
      const arr = map.get(p.directionId) ?? [];
      arr.push(p);
      map.set(p.directionId, arr);
    }
    return [...map.entries()];
  });
</script>

<div class="mx-auto max-w-5xl px-4 pb-20 pt-8">
  <div use:reveal class="mb-8 text-center">
    <div class="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15">
      <GraduationCap class="h-7 w-7 text-indigo-300" />
    </div>
    <h1 class="font-display text-2xl font-bold text-slate-50 sm:text-3xl">Каталог специализаций ИТМО</h1>
    <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
      {ITMO_PROGRAMS.length} программ бакалавриата с требованиями к поступлению:
      комбинации ЕГЭ, минимальные баллы 2026, творческие испытания и средние баллы
      зачисления 2025. Источник — правила приёма Университета ИТМО (abit.itmo.ru).
    </p>
  </div>

  <div use:reveal class="card-glass sticky top-[57px] z-10 -mx-1 mb-6 rounded-2xl p-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          bind:value={query}
          type="search"
          placeholder="Поиск по программам и кодам…"
          class="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-indigo-500"
        />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          onclick={() => (activeDir = 'all')}
          class="rounded-full border px-3 py-1.5 text-xs font-medium transition
            {activeDir === 'all'
              ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
              : 'border-slate-700 bg-slate-900/60 text-slate-500 hover:border-slate-500 hover:text-slate-300'}"
        >
          Все ({ITMO_PROGRAMS.length})
        </button>
        {#each itmoDirections() as dirId}
          {@const count = ITMO_PROGRAMS.filter((p) => p.directionId === dirId).length}
          <button
            onclick={() => (activeDir = dirId)}
            class="rounded-full border px-3 py-1.5 text-xs font-medium transition
              {activeDir === dirId
                ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-500 hover:border-slate-500 hover:text-slate-300'}"
          >
            {dirTitles[dirId] ?? dirId} ({count})
          </button>
        {/each}
      </div>
    </div>
  </div>

  {#if groups.length === 0}
    <div class="card-glass rounded-2xl p-10 text-center">
      <p class="text-sm text-slate-400">Ничего не найдено. Попробуйте другой запрос.</p>
    </div>
  {:else}
    {#each groups as [dirId, programs], gi (dirId)}
      <section class="mt-8 first:mt-0">
        <div use:reveal={{ delay: gi * 60 }} class="mb-3 flex items-center gap-3">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-300">
            {DIRECTION_BY_ID[dirId]?.title ?? dirTitles[dirId]}
          </h2>
          <span class="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-transparent"></span>
          <span class="text-xs text-slate-600">{programs.length}</span>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          {#each programs as p, i (p.id)}
            {@const req = itmoRequirements(p)}
            <article use:reveal={{ delay: i * 70 }} class="card-glass flex flex-col rounded-2xl p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold leading-snug text-slate-50">{p.title}</h3>
                  <p class="mt-0.5 font-mono text-[11px] text-slate-500">{p.code} · {dirTitles[p.directionId]}</p>
                </div>
                <a
                  href="https://abit.itmo.ru/programs/bachelor"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-400 transition hover:border-indigo-500/50 hover:text-indigo-300"
                >
                  bit.itmo.ru
                  <ExternalLink class="h-3 w-3" />
                </a>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-slate-400">{p.tagline}</p>

              <div class="mt-4">
                <div class="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-indigo-400">
                  <BookOpen class="h-3.5 w-3.5" />
                  ЕГЭ · минимум {req.minBalls} баллов{req.minBySubject ? ' (повышенный для отдельных предметов)' : ''}
                </div>
                <div class="flex flex-wrap gap-1.5">
                  {#each req.exams as set, si}
                    {#each set as subj, ji}
                      <span
                        class="rounded-md border px-2 py-1 text-[11px]
                          {req.minBySubject?.[subj]
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                            : si > 0 && ji === 0
                              ? 'border-slate-800 bg-slate-800/60 text-slate-500'
                              : 'border-indigo-500/25 bg-indigo-500/10 text-indigo-200'}"
                        title={req.minBySubject?.[subj] ? `минимум ${req.minBySubject[subj]} баллов` : `минимум ${req.minBalls} баллов`}
                      >
                        {subj}{req.minBySubject?.[subj] ? ` · ${req.minBySubject[subj]}` : ''}
                      </span>
                    {/each}
                  {/each}
                </div>
              </div>

              <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                {#if req.creative}
                  <span class="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-purple-300">
                    <Sparkles class="h-3 w-3" />
                    {req.creative}
                  </span>
                {/if}
                {#if req.avg2025}
                  <span class="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                    средний балл 2025: {req.avg2025}
                  </span>
                {/if}
                {#if req.bvi}
                  <span class="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-slate-300">
                    <Medal class="h-3 w-3 text-amber-400" />
                    БВИ по олимпиадам
                  </span>
                {/if}
              </div>

              {#if req.note}
                <p class="mt-2.5 flex items-start gap-1.5 border-t border-slate-800 pt-2.5 text-[11px] leading-relaxed text-slate-500">
                  <Info class="mt-0.5 h-3 w-3 shrink-0" />
                  {req.note}
                </p>
              {/if}
            </article>
          {/each}
        </div>
      </section>
    {/each}
  {/if}

  <div use:reveal class="card-glass mt-10 rounded-2xl p-6 text-center">
    <p class="text-sm font-semibold text-slate-200">Не уверены, куда подходит ваш профиль?</p>
    <p class="mt-1 text-xs text-slate-400">Пройдите тест — он отберёт программы ИТМО под ваши ответы.</p>
    <button
      onclick={() => startItmoTest()}
      class="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-400"
    >
      <GraduationCap class="h-4 w-4" />
      Пройти тест ИТМО
    </button>
  </div>
</div>