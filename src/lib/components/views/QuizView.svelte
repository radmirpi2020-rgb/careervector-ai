<script lang="ts">
  import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Keyboard, RotateCcw, Sparkles } from '@lucide/svelte';
  import { fade } from 'svelte/transition';
  import { onDestroy } from 'svelte';
  import {
    advanceQuestion, answerCurrent, backQuestion, confirmDirection, currentStageSize,
    getQuestion, jumpToQuestion, quizAnswers, quizIndex, quizPhase, restartStage1,
    selectAnswer, selectedDirection, stage1Total, topDirections
  } from '$lib/stores/profile';
  import { ANSWER_OPTIONS, DIRECTION_BY_ID, STAGE1_QUESTIONS, stage2QuestionsFor, type CareerDirection } from '$lib/data/directions';

  const phase = $derived($quizPhase);
  const fallbackDir: CareerDirection = { id: 'dev', title: 'Разработка', tagline: '', anchor: 'dev', groups: [] };
  const direction = $derived(DIRECTION_BY_ID[$selectedDirection] ?? fallbackDir);
  const question = $derived(getQuestion($quizIndex));
  const answers = $derived($quizAnswers ?? {});
  const stageSize = $derived(currentStageSize());
  const questions = $derived(phase === 'stage1' ? STAGE1_QUESTIONS : stage2QuestionsFor($selectedDirection));
  const progress = $derived(
    phase === 'stage1'
      ? (($quizIndex + 1) / stage1Total) * 50
      : 50 + (($quizIndex + 1) / stageSize) * 50
  );
  const candidates = $derived(topDirections(answers, 3));
  const stageAnswered = $derived(questions.filter((q) => answers[q.id]).length);
  const isCurrentAnswered = $derived(Boolean(question && answers[question.id]));

  let advanceTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    if (advanceTimer) clearTimeout(advanceTimer);
  });

  function clearAdvance() {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = undefined;
    }
  }

  function pick(optionId: string) {
    if (answers[question.id] === optionId) return;
    clearAdvance();
    selectAnswer(optionId);
    advanceTimer = setTimeout(() => {
      advanceTimer = undefined;
      advanceQuestion();
    }, 500);
  }

  function next() {
    clearAdvance();
    if (isCurrentAnswered) advanceQuestion();
  }

  function prev() {
    clearAdvance();
    backQuestion();
  }

  function goto(i: number) {
    clearAdvance();
    jumpToQuestion(i);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      prev();
      return;
    }
    if (e.key === 'ArrowRight') {
      if (isCurrentAnswered) next();
      return;
    }
    const idx = Number(e.key) - 1;
    if (phase === 'checkpoint' && idx >= 0 && idx < candidates.length) {
      confirmDirection(candidates[idx].id);
      return;
    }
    if (idx >= 0 && idx < ANSWER_OPTIONS.length) {
      clearAdvance();
      answerCurrent(ANSWER_OPTIONS[idx].id);
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mx-auto max-w-2xl px-4 pb-20 pt-8">
  <div class="mb-6">
    <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
      <span>
        {#if phase === 'stage1'}
          Тест 1 из 2 · Направление
        {:else if phase === 'checkpoint'}
          Результат теста 1
        {:else}
          Тест 2 из 2 · Специализация
        {/if}
      </span>
      {#if phase === 'stage2'}
        <span class="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-300">
          {direction.title}
        </span>
      {:else if phase !== 'checkpoint'}
        <span class="inline-flex items-center gap-1">
          <Keyboard class="h-3.5 w-3.5" />
          1–4 для ответа · ← → для навигации
        </span>
      {/if}
    </div>

    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style="width: {progress}%"></div>
    </div>

    {#if phase !== 'checkpoint'}
      <div class="mt-3 flex items-center justify-between gap-3">
        <span class="text-xs font-medium text-slate-400">
          Вопрос {phase === 'stage2' ? $quizIndex + 1 : $quizIndex + 1} из {questions.length}
          <span class="text-slate-600">· отвечено {stageAnswered}</span>
        </span>
        <span class="text-[11px] text-slate-600">нажмите на точку, чтобы перейти к вопросу</span>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5" aria-label="Навигация по вопросам">
        {#each questions as q, i (q.id)}
          <button
            title="Вопрос {i + 1}{answers[q.id] ? ' — отвечен' : ''}"
            onclick={() => goto(i)}
            aria-label="Перейти к вопросу {i + 1}"
            class="h-3 w-3 rounded-full transition hover:scale-125
              {answers[q.id]
                ? i === $quizIndex
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/40'
                  : 'bg-indigo-500'
                : i === $quizIndex
                  ? 'bg-slate-300 ring-2 ring-slate-300/40'
                  : 'bg-slate-700'}"
          ></button>
        {/each}
      </div>
    {/if}
  </div>

  {#if phase === 'checkpoint'}
    <div class="text-center">
      <div class="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15">
        <Sparkles class="h-7 w-7 text-indigo-300" />
      </div>
      <h2 class="text-xl font-bold text-slate-50 sm:text-2xl">Ваше направление</h2>
      <p class="mx-auto mt-2 max-w-md text-sm text-slate-400">
        По вашим ответам вы ближе всего к сфере «{candidates[0]?.title ?? '—'}».
        Подтвердите или выберите другое — тест специализаций
        ({stage2QuestionsFor($selectedDirection).length} вопросов) продолжится по нему.
      </p>
    </div>

    <div class="mt-8 flex flex-col gap-3">
      {#each candidates as c, i}
        <button
          onclick={() => confirmDirection(c.id)}
          class="group flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition
            {i === 0
              ? 'border-indigo-500/60 bg-indigo-500/10 hover:bg-indigo-500/15'
              : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'}"
        >
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xs font-bold text-slate-400">
              {i + 1}
            </span>
            <div>
              <div class="text-sm font-semibold text-slate-200">
                {c.title}
                {#if i === 0}
                  <span class="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">подходит больше всего</span>
                {/if}
              </div>
              <div class="text-xs text-slate-500">{c.tagline}</div>
            </div>
          </div>
          <ChevronRight class="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-indigo-300" />
        </button>
      {/each}
    </div>

    <div class="mt-6 flex justify-center gap-3">
      <button
        onclick={restartStage1}
        class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        <RotateCcw class="h-4 w-4" />
        Перепройти тест 1
      </button>
    </div>
  {:else}
    {#key question.id}
      <div transition:fade={{ duration: 200 }}>
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          {#if phase === 'stage2'}
            <div class="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-400">
              {direction.title} · {Math.floor(($quizIndex / Math.max(1, questions.length)) * 3) + 1}-й блок из 3
            </div>
          {/if}
          <h2 class="text-lg font-semibold leading-snug text-slate-50 sm:text-xl">{question.statement}</h2>
        </div>

        <div class="mt-5 flex flex-col gap-3">
          {#each ANSWER_OPTIONS as opt, i (opt.id)}
            {@const isAnswered = answers[question.id] === opt.id}
            <button
              onclick={() => pick(opt.id)}
              class="group flex items-center gap-3 rounded-xl border p-4 text-left transition
                {isAnswered
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'}"
            >
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold
                  {isAnswered
                    ? 'border-emerald-500/60 text-emerald-300'
                    : 'border-slate-700 text-slate-500 transition group-hover:border-indigo-500/60 group-hover:text-indigo-300'}"
              >
                {i + 1}
              </span>
              <span class="text-sm leading-relaxed text-slate-300">
                {opt.label}
                <span class="ml-2 text-xs text-slate-600">— {i === 0 ? 'полностью согласен(на)' : i === 1 ? 'частично согласен(на)' : i === 2 ? 'частично не согласен(на)' : 'не согласен(на)'}</span>
              </span>
              {#if isAnswered}
                <CheckCircle2 class="ml-auto h-5 w-5 shrink-0 text-emerald-400" />
              {/if}
            </button>
          {/each}
        </div>

        <div class="mt-6 flex items-center justify-between gap-3">
          <button
            onclick={prev}
            class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
            disabled={phase === 'stage1' && $quizIndex === 0}
          >
            <ArrowLeft class="h-4 w-4" />
            {phase === 'stage2' && $quizIndex === 0 ? 'К выбору направления' : 'Назад'}
          </button>
          {#if isCurrentAnswered}
            <button
              onclick={next}
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
            >
              {phase === 'stage1' && $quizIndex === questions.length - 1
                ? 'Показать направление'
                : phase === 'stage2' && $quizIndex === questions.length - 1
                  ? 'Перейти к навыкам'
                  : 'Далее'}
              <ArrowRight class="h-4 w-4" />
            </button>
          {/if}
        </div>
      </div>
    {/key}
  {/if}
</div>
