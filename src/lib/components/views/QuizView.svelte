<script lang="ts">
  import { ArrowLeft, CheckCircle2, ChevronRight, Keyboard, RotateCcw, Sparkles } from '@lucide/svelte';
  import { fade } from 'svelte/transition';
  import {
    answerCurrent, backQuestion, getQuestion, quizAnswers, quizIndex, quizPhase,
    restartStage1, confirmDirection, selectedDirection, stage1Total, currentStageSize,
    topDirections
  } from '$lib/stores/profile';
  import { ANSWER_OPTIONS, DIRECTION_BY_ID, type CareerDirection } from '$lib/data/directions';

  const phase = $derived($quizPhase);
  const fallbackDir: CareerDirection = { id: 'dev', title: 'Разработка', tagline: '', anchor: 'dev', groups: [] };
  const direction = $derived(DIRECTION_BY_ID[$selectedDirection] ?? fallbackDir);
  const question = $derived(getQuestion($quizIndex));
  const answers = $derived($quizAnswers ?? {});
  const stageSize = $derived(currentStageSize());
  const progress = $derived(
    phase === 'stage1'
      ? (($quizIndex + 1) / stage1Total) * 50
      : 50 + (($quizIndex + 1) / stageSize) * 50
  );
  const candidates = $derived(topDirections(answers, 3));

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      backQuestion();
      return;
    }
    const idx = Number(e.key) - 1;
    if (phase === 'checkpoint' && idx >= 0 && idx < candidates.length) {
      confirmDirection(candidates[idx].id);
      return;
    }
    if (idx >= 0 && idx < ANSWER_OPTIONS.length) {
      answerCurrent(ANSWER_OPTIONS[idx].id);
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mx-auto max-w-2xl px-4 pb-20 pt-8">
  <div class="mb-8">
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
      {:else}
        <span class="inline-flex items-center gap-1">
          <Keyboard class="h-3.5 w-3.5" />
          {phase === 'checkpoint' ? 'клавиши 1–3 для выбора' : 'клавиши 1–4 · ← назад'}
        </span>
      {/if}
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style="width: {progress}%"></div>
    </div>
  </div>

  {#if phase === 'checkpoint'}
    <div class="text-center">
      <div class="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15">
        <Sparkles class="h-7 w-7 text-indigo-300" />
      </div>
      <h2 class="text-xl font-bold text-slate-50 sm:text-2xl">Ваше направление</h2>
      <p class="mx-auto mt-2 max-w-md text-sm text-slate-400">
        По вашим ответам вы ближе всего к сфере «{candidates[0]?.title ?? '—'}».
        Подтвердите или выберите другое — тест специализаций продолжится по нему.
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
      <div transition:fade={{ duration: 220 }}>
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          {#if phase === 'stage2'}
            <div class="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-400">{direction.title}</div>
          {/if}
          <h2 class="text-lg font-semibold leading-snug text-slate-50 sm:text-xl">{question.statement}</h2>
        </div>

        <div class="mt-5 flex flex-col gap-3">
          {#each ANSWER_OPTIONS as opt, i (opt.id)}
            {@const isAnswered = answers[question.id] === opt.id}
            <button
              onclick={() => answerCurrent(opt.id)}
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

        {#if $quizIndex > 0 || phase === 'stage2'}
          <button
            onclick={backQuestion}
            class="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
          >
            <ArrowLeft class="h-4 w-4" />
            {phase === 'stage2' && $quizIndex === 0 ? 'К выбору направления' : 'К предыдущему вопросу'}
          </button>
        {/if}
      </div>
    {/key}
  {/if}
</div>