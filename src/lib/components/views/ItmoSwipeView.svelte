<script lang="ts">
  import { ArrowRight, Check, Hand, Home, RotateCcw, SkipForward, ThumbsDown, ThumbsUp } from '@lucide/svelte';
  import { onDestroy } from 'svelte';
  import {
    answerSwipe, goItmoPart, itmoCardIndex, itmoPartIndex, itmoParts, itmoSwipeAnswers,
    setView, skipItmoPart, startItmoSwipe
  } from '$lib/stores/profile';
  import { ITMO_SWIPE_TOTAL_QUESTIONS } from '$lib/data/itmo';

  const parts = $derived($itmoParts);
  const partIndex = $derived($itmoPartIndex);
  const cardIndex = $derived($itmoCardIndex);
  const part = $derived(parts[partIndex]);
  const question = $derived(part?.questions[cardIndex]);
  const answers = $derived($itmoSwipeAnswers ?? {});
  const answeredCount = $derived(Object.keys(answers).length);
  const doneParts = $derived(parts.filter((p) => p.questions.length > 0 && p.questions.every((q) => answers[q.id] !== undefined)));

  let intro = $state(true);
  let tx = $state(0);
  let dragging = $state(false);
  let leaving = $state(false);
  let leaveTarget = $state(0);
  let startX = 0;

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const commitDelay = reducedMotion ? 0 : 240;

  const noOpacity = $derived(tx < 0 ? Math.min(1, -tx / 130) : 0);
  const yesOpacity = $derived(tx > 0 ? Math.min(1, tx / 130) : 0);
  const glow = $derived(
    leaving
      ? leaveTarget > 0
        ? 'ring-2 ring-emerald-400/70 shadow-[0_0_42px_-6px_rgba(16,185,129,0.5)]'
        : 'ring-2 ring-rose-500/70 shadow-[0_0_42px_-6px_rgba(244,63,94,0.5)]'
      : tx > 0
        ? 'ring-2 ring-emerald-400/70 shadow-[0_0_42px_-6px_rgba(16,185,129,0.5)]'
        : tx < 0
          ? 'ring-2 ring-rose-500/70 shadow-[0_0_42px_-6px_rgba(244,63,94,0.5)]'
          : 'shadow-lg shadow-slate-950/40'
  );

  let flyTimer: ReturnType<typeof setTimeout> | undefined;
  onDestroy(() => {
    if (flyTimer) clearTimeout(flyTimer);
  });

  function flyOut(dir: 1 | -1) {
    if (!question || leaving) return;
    leaving = true;
    leaveTarget = dir * 420;
    tx = leaveTarget;
    flyTimer = setTimeout(() => {
      answerSwipe(question.id, dir === 1);
      leaving = false;
      tx = 0;
    }, commitDelay);
  }

  function onPointerDown(e: PointerEvent) {
    if (!question || leaving) return;
    dragging = true;
    startX = e.clientX;
    const el = e.currentTarget as HTMLElement;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // старые браузеры — работаем без захвата указателя
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging || leaving) return;
    tx = Math.max(-300, Math.min(300, e.clientX - startX));
  }

  function endDrag() {
    if (!dragging || leaving) return;
    dragging = false;
    if (Math.abs(tx) >= 110) flyOut(tx > 0 ? 1 : -1);
    else tx = 0;
  }

  function onKeydown(e: KeyboardEvent) {
    if (intro || leaving || !question) return;
    if (e.key === 'ArrowLeft') flyOut(-1);
    else if (e.key === 'ArrowRight') flyOut(1);
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mx-auto max-w-3xl px-4 pb-20 pt-8">
  {#if intro}
    <div class="card-glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-10">
      <div class="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true"></div>
      <div class="relative">
        <div class="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-500/15 text-3xl">
          <Hand class="h-8 w-8 text-emerald-300" />
        </div>
        <h1 class="font-display text-2xl font-bold text-slate-50 sm:text-3xl">Свайп-тест ИТМО</h1>
        <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
          Вместо долгих опросников — лёгкие карточки: читаешь утверждение и свайпаешь
          <span class="font-medium text-emerald-300">вправо</span>, если это про тебя, или
          <span class="font-medium text-rose-300">влево</span>, если нет. Но можно и просто
          нажать «Да» / «Нет» или стрелки на клавиатуре.
        </p>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
          <span class="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1">
            {parts.length || 8} частей
          </span>
          <span class="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1">
            {ITMO_SWIPE_TOTAL_QUESTIONS} утверждений
          </span>
          <span class="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1">
            любая часть пропускается
          </span>
        </div>
        <button
          onclick={() => (intro = false)}
          class="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Поехали
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  {:else if parts.length === 0}
    <div class="card-glass rounded-3xl p-10 text-center">
      <p class="text-sm text-slate-400">Тест ещё не запущен.</p>
      <button
        onclick={startItmoSwipe}
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        <RotateCcw class="h-4 w-4" />
        Начать свайп-тест
      </button>
    </div>
  {:else}
    <div class="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span class="font-medium text-slate-300">
          Свайп-тест ИТМО
          <span class="text-slate-600">· часть {partIndex + 1} из {parts.length}</span>
        </span>
        <span class="hidden items-center gap-1.5 text-slate-600 sm:inline-flex">
          <Hand class="h-3.5 w-3.5" />
          свайп вправо — да · влево — нет · ← → на клавиатуре
        </span>
        <button
          onclick={startItmoSwipe}
          class="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
          title="Начать тест заново"
        >
          <RotateCcw class="h-3 w-3" />
          Заново
        </button>
      </div>

      <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
          style="width: {(answeredCount / ITMO_SWIPE_TOTAL_QUESTIONS) * 100}%"
        ></div>
      </div>
      <div class="mt-1.5 text-[11px] text-slate-500">
        Ответов: <span class="text-slate-300">{answeredCount}</span> из {ITMO_SWIPE_TOTAL_QUESTIONS}
      </div>

      <div class="mt-3 flex flex-wrap gap-1.5" aria-label="Навигация по частям">
        {#each parts as p, i (p.id)}
          {@const done = doneParts.includes(p)}
          <button
            onclick={() => goItmoPart(i)}
            title="{p.title} — {p.questions.length} утверждений"
            class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition
              {i === partIndex
                ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
                : done
                  ? 'border-emerald-600/40 bg-emerald-900/40 text-emerald-400/80'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200'}"
          >
            {p.emoji} {p.title}
            {#if done}
              <Check class="h-3 w-3" />
            {/if}
          </button>
        {/each}
      </div>
    </div>

    {#if question}
      <div class="relative mx-auto mt-6 h-72 w-full max-w-md sm:h-80">
        <div class="card-glass absolute inset-0 flex flex-col justify-between rounded-2xl p-7 opacity-40" aria-hidden="true">
          <div class="text-[11px] uppercase tracking-wider text-slate-500">следующая карточка</div>
          <div class="text-sm italic text-slate-500">свайпни — узнаешь, что дальше</div>
        </div>

        <div
          class="card-glass card-swipe absolute inset-0 cursor-grab rounded-2xl p-7 active:cursor-grabbing {glow}"
          style="transform: translateX({tx}px) rotate({tx * 0.06}deg)"
          role="button"
          tabindex="0"
          aria-label="Утверждение — свайпните вправо для да, влево для нет"
          onpointerdown={onPointerDown}
          onpointermove={onPointerMove}
          onpointerup={endDrag}
          onpointercancel={endDrag}
        >
          <div class="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-rose-400/60 bg-rose-500/20 px-3 py-1 text-sm font-bold text-rose-300 backdrop-blur transition-opacity duration-150" style="opacity: {noOpacity}">
            НЕТ
          </div>
          <div class="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-3 py-1 text-sm font-bold text-emerald-300 backdrop-blur transition-opacity duration-150" style="opacity: {yesOpacity}">
            ДА
          </div>

          {#key question.id}
            <div class="card-swipe-in flex h-full flex-col">
              <div class="mb-3 flex items-center justify-between gap-2 text-[11px] uppercase tracking-wider">
                <span class="font-semibold text-emerald-400">{part.emoji} {part.title}</span>
                <span class="text-slate-500">{cardIndex + 1} / {part.questions.length}</span>
              </div>
              <div class="flex flex-1 items-center">
                <h2 class="text-lg font-semibold leading-snug text-slate-50 sm:text-xl">{question.statement}</h2>
              </div>
              <div class="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style="width: {(cardIndex / part.questions.length) * 100}%"
                ></div>
              </div>
            </div>
          {/key}
        </div>
      </div>

      <div class="mx-auto mt-6 flex max-w-md items-center justify-between gap-3">
        <button
          onclick={() => flyOut(-1)}
          disabled={leaving}
          class="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-40"
        >
          <ThumbsDown class="h-4 w-4" />
          Нет
        </button>
        <button
          onclick={skipItmoPart}
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2.5 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
          title="Пропустить часть — программы этой части не попадут в результат"
        >
          <SkipForward class="h-3.5 w-3.5" />
          Пропустить часть
        </button>
        <button
          onclick={() => flyOut(1)}
          disabled={leaving}
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:opacity-40"
        >
          <ThumbsUp class="h-4 w-4" />
          Да
        </button>
      </div>

      <div class="mt-4 flex justify-center">
        <button
          onclick={() => setView('start')}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition hover:text-slate-300"
        >
          <Home class="h-3.5 w-3.5" />
          Выйти на главную
        </button>
      </div>
    {/if}
  {/if}
</div>