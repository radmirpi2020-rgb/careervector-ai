<script lang="ts">
  import { Radar, ShieldCheck, Sparkles, ListChecks, FileText, CircleGauge, ArrowRight, GraduationCap, ChevronDown } from '@lucide/svelte';
  import { profile, setView, startAudit, startItmoTest } from '$lib/stores/profile';
  import { psychotypeCode, psychotypeLabel } from '$lib/engine/matching';
  import { ROLES } from '$lib/data/roles';
  import { STAGE1_QUESTIONS, STAGE2_QUESTIONS, DIRECTIONS } from '$lib/data/directions';
  import { ITMO_PROGRAMS, itmoDirections } from '$lib/data/itmo';
  import { reveal } from '$lib/actions/reveal';
  import CountUp from '$lib/components/CountUp.svelte';

  const stage2Total = Object.values(STAGE2_QUESTIONS).reduce((acc, qs) => acc + qs.length, 0);
  const stage2Sizes = Object.values(STAGE2_QUESTIONS).map((qs) => qs.length);
  const stage2Min = stage2Sizes.length ? Math.min(...stage2Sizes) : 0;
  const stage2Max = stage2Sizes.length ? Math.max(...stage2Sizes) : 0;

  const itmoDirTitles: Record<string, string> = {
    dev: 'Разработка',
    data: 'Данные и аналитика',
    infra: 'Инженерия и инфраструктура',
    product: 'Продукт и дизайн',
    mgmt: 'Менеджмент'
  };

  let itmoSelected = $state<string[]>(itmoDirections());

  function toggleItmoDir(id: string) {
    if (itmoSelected.includes(id)) itmoSelected = itmoSelected.filter((x) => x !== id);
    else itmoSelected = [...itmoSelected, id];
  }

  function startItmo() {
    startItmoTest(itmoSelected);
  }

  const features = [
    { icon: ListChecks, title: '3 теста: направление → специализация → ИТМО', text: `Сначала тест из ${STAGE1_QUESTIONS.length} вопросов выберет направление, затем ${stage2Min}–${stage2Max} вопросов уточнят специализацию, а третий — случайная сборка — подберёт программы бакалавриата ИТМО из ${ITMO_PROGRAMS.length} в каталоге.` },
    { icon: CircleGauge, title: 'Векторный матчинг', text: `Сопоставление вашего психопрофиля RIASEC и скилл-сета с каталогом из ${ROLES.length}+ ролей.` },
    { icon: FileText, title: 'Скилл-гэп аудит', text: 'Разбор дефицита навыков с расчётом сроков перехода и зарплатной вилки.' },
    { icon: Radar, title: 'Радары компетенций', text: 'Наглядная карта ваших сильных сторон и точек роста относительно целевой роли.' },
    { icon: ShieldCheck, title: 'Zero-Knowledge', text: 'Все данные — резюме, ответы, роадмапы — хранятся только в вашем браузере. Ничего не уходит на сервер.' }
  ];

  const stats = [
    { value: ROLES.length + 1, suffix: '+', label: 'ролей в каталоге' },
    { value: DIRECTIONS.length, suffix: '', label: 'направлений' },
    { value: STAGE1_QUESTIONS.length + stage2Total, suffix: '', label: 'вопросов в аудите' },
    { value: ITMO_PROGRAMS.length, suffix: '', label: 'программ ИТМО' }
  ];
</script>

<div class="mx-auto max-w-5xl px-4 pb-20">
  <section class="relative pt-16 pb-12 text-center sm:pt-24">
    <div class="pointer-events-none absolute inset-x-0 -top-24 h-64 overflow-hidden" aria-hidden="true">
      <div class="bg-grid absolute inset-0"></div>
    </div>

    <div use:reveal class="relative">
      <div class="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur">
        <Sparkles class="h-3.5 w-3.5" />
        Локальный ИИ-навигатор карьеры · v1.0 MVP
      </div>
      <h1 class="font-display mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl">
        Найди профессию, куда
        <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent text-glow">переход реально выгоден</span>
      </h1>
      <p class="text-balance mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        Никаких шаблонных гороскопов. Три последовательных теста с простыми ответами «да» и «нет»,
        векторное сопоставление с каталогом профессий и персональный роадмап закрытия скилл-гэпа.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onclick={startAudit}
          class="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-400 animate-pulse-soft"
        >
          Пройти экспресс-аудит
          <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
        {#if $profile}
          <button
            onclick={() => setView('results')}
            class="rounded-xl border border-slate-700 bg-slate-800/60 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Мои результаты ({psychotypeCode($profile.psychology)} · {psychotypeLabel($profile.psychology)})
          </button>
        {/if}
      </div>
      <div class="mt-8 hidden items-center justify-center gap-1.5 text-xs text-slate-600 sm:flex">
        <ChevronDown class="h-3.5 w-3.5" />
        это займёт ~7 минут
      </div>
    </div>
  </section>

  <section class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each stats as stat, i (stat.label)}
      <div
        use:reveal={{ delay: i * 90 }}
        class="card-glass rounded-2xl p-4 text-center"
      >
        <div class="text-3xl font-extrabold tracking-tight text-slate-50">
          <CountUp value={stat.value} />{stat.suffix}
        </div>
        <div class="mt-1 text-xs text-slate-500">{stat.label}</div>
      </div>
    {/each}
  </section>

  <section class="mt-14">
    <div use:reveal class="mb-5 text-center">
      <div class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Как это работает</div>
      <h2 class="mt-2 text-xl font-bold text-slate-100 sm:text-2xl">Один сценарий — от теста до плана</h2>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each features as f, i (f.title)}
        <div use:reveal={{ delay: i * 80 }} class="card-glass rounded-2xl p-5">
          <span class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-emerald-500/20 text-indigo-300 ring-1 ring-indigo-500/25">
            <f.icon class="h-5.5 w-5.5" />
          </span>
          <h3 class="text-sm font-semibold text-slate-100">{f.title}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="mt-14">
    <div use:reveal class="mb-5 text-center">
      <div class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">И третья опция</div>
      <h2 class="mt-2 text-xl font-bold text-slate-100 sm:text-2xl">Специализации ИТМО</h2>
    </div>
    <div use:reveal class="card-glass rounded-3xl p-6">
      <p class="text-sm leading-relaxed text-slate-400">
        Случайная сборка: по 2 вопроса из каждого выбранного направления, затем общая перетасовка.
        Баллы взвешиваются по приоритету программ — в конце вы получите топ программ бакалавриата
        Университета ИТМО под ваш профиль (по данным abit.itmo.ru).
      </p>
      <div class="mt-5 flex flex-wrap gap-2">
        {#each itmoDirections() as dirId}
          <button
            onclick={() => toggleItmoDir(dirId)}
            class="rounded-full border px-3.5 py-1.5 text-xs font-medium transition
              {itmoSelected.includes(dirId)
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-500 hover:border-slate-500 hover:text-slate-300'}"
          >
            {itmoDirTitles[dirId] ?? dirId}
          </button>
        {/each}
      </div>
      <button
        onclick={startItmo}
        disabled={itmoSelected.length === 0}
        class="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GraduationCap class="h-4 w-4" />
        Пройти тест ИТМО ({itmoSelected.length * 2} вопросов)
      </button>
    </div>
  </section>

  <section class="mt-14">
    <div use:reveal class="mb-5 text-center">
      <div class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Доверие</div>
      <h2 class="mt-2 text-xl font-bold text-slate-100 sm:text-2xl">Приватность — архитектурный принцип</h2>
    </div>
    <div use:reveal class="card-glass rounded-3xl p-6">
      <p class="text-sm leading-relaxed text-slate-400">
        Профиль, ответы и роадмапы хранятся в localStorage вашего браузера и никуда не передаются.
        Психометрические расчёты выполняются локально. Подготовка к версии v2.0 предусматривает
        локальные эмбеддинги через Transformers.js (Wasm) и шифрование AES-GCM 256 через Web Crypto API.
      </p>
    </div>
  </section>
</div>