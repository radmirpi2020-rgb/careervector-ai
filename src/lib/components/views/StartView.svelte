<script lang="ts">
  import { Radar, ShieldCheck, Sparkles, ListChecks, FileText, CircleGauge, ArrowRight, Split } from '@lucide/svelte';
  import { profile, setView, startAudit } from '$lib/stores/profile';
  import { psychotypeCode, psychotypeLabel } from '$lib/engine/matching';
  import { ROLES } from '$lib/data/roles';
  import { STAGE1_QUESTIONS, STAGE2_QUESTIONS, DIRECTIONS } from '$lib/data/directions';

  const stage2Total = Object.values(STAGE2_QUESTIONS).reduce((acc, qs) => acc + qs.length, 0);
  const stage2Sizes = Object.values(STAGE2_QUESTIONS).map((qs) => qs.length);
  const stage2Min = stage2Sizes.length ? Math.min(...stage2Sizes) : 0;
  const stage2Max = stage2Sizes.length ? Math.max(...stage2Sizes) : 0;

  const features = [
    { icon: Split, title: '2 теста: направление → специализация', text: `Сначала тест из ${STAGE1_QUESTIONS.length} вопросов выберет ваше направление, затем ${stage2Min}–${stage2Max} вопросов уточнят специализацию — всего ${STAGE1_QUESTIONS.length + stage2Total}. Простые ответы «да / скорее да / скорее нет / нет».` },
    { icon: CircleGauge, title: 'Векторный матчинг', text: `Сопоставление вашего психопрофиля RIASEC и скилл-сета с каталогом из ${ROLES.length}+ ролей.` },
    { icon: FileText, title: 'Скилл-гэп аудит', text: 'Разбор дефицита навыков с расчётом сроков перехода и зарплатной вилки.' },
    { icon: Radar, title: 'Радары компетенций', text: 'Наглядная карта ваших сильных сторон и точек роста относительно целевой роли.' },
    { icon: ShieldCheck, title: 'Zero-Knowledge', text: 'Все данные — резюме, ответы, роадмапы — хранятся только в вашем браузере. Ничего не уходит на сервер.' }
  ];

  const stats = [
    { value: `${ROLES.length}+`, label: 'ролей в каталоге' },
    { value: `${DIRECTIONS.length}`, label: 'направлений · 2 теста' },
    { value: `${STAGE1_QUESTIONS.length + stage2Total}`, label: 'вопросов да/нет' },
    { value: '0', label: 'байт данных на сервере' }
  ];
</script>

<div class="mx-auto max-w-5xl px-4 pb-20">
  <section class="pt-14 pb-10 text-center">
    <div class="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
      <Sparkles class="h-3.5 w-3.5" />
      Локальный ИИ-навигатор карьеры · v1.0 MVP
    </div>
    <h1 class="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-5xl">
      Найди профессию, куда
      <span class="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">переход реально выгоден</span>
    </h1>
    <p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
      Никаких шаблонных гороскопов. Два последовательных теста с простыми ответами «да» и «нет»,
      векторное сопоставление с каталогом профессий и персональный роадмап закрытия скилл-гэпа.
    </p>
    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        onclick={startAudit}
        class="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
      >
        Пройти экспресс-аудит
        <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
      </button>
      {#if $profile}
        <button
          onclick={() => setView('results')}
          class="rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
        >
          Мои результаты ({psychotypeCode($profile.psychology)} · {psychotypeLabel($profile.psychology)})
        </button>
      {/if}
    </div>
  </section>

  <section class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each stats as stat}
      <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
        <div class="text-2xl font-extrabold text-slate-50">{stat.value}</div>
        <div class="mt-1 text-xs text-slate-500">{stat.label}</div>
      </div>
    {/each}
  </section>

  <section class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each features as f}
      <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
        <f.icon class="mb-3 h-6 w-6 text-indigo-400" />
        <h3 class="text-sm font-semibold text-slate-100">{f.title}</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
      </div>
    {/each}
  </section>

  <section class="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
    <h2 class="flex items-center gap-2 text-sm font-semibold text-emerald-300">
      <ShieldCheck class="h-4 w-4" />
      Приватность — архитектурный принцип
    </h2>
    <p class="mt-2 text-sm leading-relaxed text-slate-400">
      Профиль, ответы и роадмапы хранятся в localStorage вашего браузера и никуда не передаются.
      Психометрические расчёты выполняются локально. Подготовка к версии v2.0 предусматривает
      локальные эмбеддинги через Transformers.js (Wasm) и шифрование AES-GCM 256 через Web Crypto API.
    </p>
  </section>
</div>
