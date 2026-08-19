<script lang="ts">
  import '../app.css';
  import { Compass, RefreshCw, LayoutDashboard, Home, GraduationCap, Library } from '@lucide/svelte';
  import { profile, resetAll, setView, startAudit, view } from '$lib/stores/profile';
  import StartView from '$lib/components/views/StartView.svelte';
  import QuizView from '$lib/components/views/QuizView.svelte';
  import SkillsView from '$lib/components/views/SkillsView.svelte';
  import ResultsView from '$lib/components/views/ResultsView.svelte';
  import RoadmapView from '$lib/components/views/RoadmapView.svelte';
  import ItmoResultsView from '$lib/components/views/ItmoResultsView.svelte';
  import ItmoCatalogView from '$lib/components/views/ItmoCatalogView.svelte';

  function goHome() {
    setView('start');
  }

  function goResults() {
    if ($profile) setView('results');
    else startAudit();
  }
</script>

<div class="bg-slate-950 text-slate-200">
  <div class="bg-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></div>

  <header class="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <button onclick={goHome} class="group flex items-center gap-2.5 text-left">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/30 transition group-hover:scale-105">
          <Compass class="h-5 w-5 text-white" />
        </span>
        <span class="hidden sm:block">
          <span class="block text-sm font-bold leading-tight text-slate-50">CareerVector AI</span>
          <span class="block text-[10px] leading-tight text-slate-500">навигатор карьерных траекторий</span>
        </span>
      </button>
      <nav class="flex items-center gap-1.5">
        <button
          onclick={goHome}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <Home class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Главная</span>
        </button>
        <button
          onclick={goResults}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <LayoutDashboard class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Результаты</span>
        </button>
        <button
          onclick={() => setView('itmo-catalog')}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <Library class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Каталог ИТМО</span>
        </button>
        <button
          onclick={() => setView('itmo-results')}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <GraduationCap class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">ИТМО</span>
        </button>
        <button
          onclick={resetAll}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400/80 transition hover:bg-rose-500/10 hover:text-rose-300"
          title="Сбросить профиль и пройти аудит заново"
        >
          <RefreshCw class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Сбросить</span>
        </button>
      </nav>
    </div>
  </header>

  <main>
    {#if $view === 'start'}
      <StartView />
    {:else if $view === 'quiz'}
      <QuizView />
    {:else if $view === 'skills'}
      <SkillsView />
    {:else if $view === 'results'}
      <ResultsView />
    {:else if $view === 'roadmap'}
      <RoadmapView />
    {:else if $view === 'itmo-results'}
      <ItmoResultsView />
    {:else if $view === 'itmo-catalog'}
      <ItmoCatalogView />
    {/if}
    <slot />
  </main>

  <footer class="border-t border-slate-800/60 py-10">
    <div class="mx-auto max-w-6xl px-4 text-center">
      <div class="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
        <Compass class="h-5 w-5 text-white" />
      </div>
      <p class="text-xs text-slate-500">
        CareerVector AI v1.0 MVP · Zero-Knowledge Profiling: все данные хранятся локально в вашем браузере
      </p>
      <p class="mt-1.5 text-[11px] text-slate-600">
        Векторное сопоставление RIASEC · TFI-индекс реализуемости перехода · онтология 150+ ролей ·
        каталог программ ИТМО
      </p>
      <p class="mt-4 text-[11px] text-slate-700">
        Сделано с любовью к данным и приватности · 2 теста на психотип + 1 тест на специализации ИТМО
      </p>
    </div>
  </footer>
</div>