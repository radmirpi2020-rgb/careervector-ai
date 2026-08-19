<script lang="ts">
  import { GraduationCap, Home, Library, RefreshCw, Star, Trophy } from '@lucide/svelte';
  import { itmoMatches, itmoQuestions, setView, startItmoTest } from '$lib/stores/profile';

  const matches = $derived($itmoMatches ?? []);
  const asked = $derived($itmoQuestions.length);

  function again() {
    startItmoTest();
  }
</script>

<div class="mx-auto max-w-3xl px-4 pb-20 pt-8">
  <div class="mb-6 text-center">
    <div class="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
      <GraduationCap class="h-7 w-7 text-emerald-300" />
    </div>
    <h1 class="text-2xl font-bold text-slate-50 sm:text-3xl">Программы ИТМО под ваш профиль</h1>
    <p class="mx-auto mt-2 max-w-md text-sm text-slate-400">
      По {asked} вопросам случайной сборки, взвешенным по приоритету программ.
      Каждый тест собирается заново — результат меняется, но топ-направление остаётся стабильным.
    </p>
  </div>

  {#if matches.length === 0}
    <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
      <p class="text-sm text-slate-400">Пока нет ответов — пройдите тест, чтобы увидеть подборку программ.</p>
      <button onclick={again} class="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
        <RefreshCw class="h-4 w-4" />
        Пройти тест ИТМО
      </button>
    </div>
  {:else}
    <div class="flex flex-col gap-3">
      {#each matches as m, i}
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-emerald-500/40">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-sm font-bold text-emerald-300">
                {i + 1}
              </div>
              <div>
                <h3 class="flex items-center gap-2 font-semibold text-slate-50">
                  {m.program.title}
                  {#if i === 0}
                    <span class="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                      <Trophy class="h-3 w-3" />
                      лучший вариант
                    </span>
                  {/if}
                </h3>
                <p class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span class="font-mono text-slate-400">{m.program.code}</span>
                  <span class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                    {m.directionTitle}
                  </span>
                  <span class="inline-flex items-center gap-0.5" title="Приоритет программы (1–5)">
                    {#each Array.from({ length: 5 }) as _, k}
                      <Star class="h-3 w-3 {k < m.program.priority ? 'text-amber-400' : 'text-slate-700'}" fill={k < m.program.priority ? 'currentColor' : 'none'} />
                    {/each}
                  </span>
                </p>
                <p class="mt-1.5 text-sm text-slate-400">{m.program.tagline}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-extrabold text-emerald-300">{m.percent}%</div>
              <div class="text-[11px] text-slate-500">совпадение</div>
            </div>
          </div>
          <div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" style="width: {m.percent}%"></div>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-6 flex flex-wrap justify-center gap-3">
      <button
        onclick={again}
        class="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
      >
        <RefreshCw class="h-4 w-4" />
        Собрать новый тест
      </button>
      <button
        onclick={() => setView('itmo-catalog')}
        class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        <Library class="h-4 w-4" />
        Весь каталог и требования ЕГЭ
      </button>
      <button
        onclick={() => setView('start')}
        class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        <Home class="h-4 w-4" />
        На главную
      </button>
    </div>
  {/if}
</div>
