<script lang="ts">
  import { ArrowLeft, CheckCircle2, Keyboard } from '@lucide/svelte';
  import { fade } from 'svelte/transition';
  import { answerCurrent, backQuestion, getQuestion, quizAnswers, quizIndex, totalQuestions } from '$lib/stores/profile';

  const question = $derived(getQuestion($quizIndex));
  const progress = $derived((($quizIndex + 1) / totalQuestions) * 100);
  const currentAnswers = $derived($quizAnswers ?? {});

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' && $quizIndex > 0) {
      backQuestion();
      return;
    }
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < question.options.length) {
      e.preventDefault();
      answerCurrent(question.options[idx].id);
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mx-auto max-w-2xl px-4 pb-20 pt-8">
  <div class="mb-8">
    <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
      <span>Кейс {$quizIndex + 1} из {totalQuestions}</span>
      <span class="inline-flex items-center gap-1">
        <Keyboard class="h-3.5 w-3.5" />
        клавиши 1–{question.options.length} · ← назад
      </span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style="width: {progress}%"></div>
    </div>
  </div>

  {#key question.id}
    <div transition:fade={{ duration: 220 }}>
    <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
      {#if question.context}
        <div class="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-400">{question.context}</div>
      {/if}
      <h2 class="text-lg font-semibold leading-snug text-slate-50 sm:text-xl">{question.scenario}</h2>
    </div>

    <div class="mt-5 flex flex-col gap-3">
      {#each question.options as opt, i (opt.id)}
        {@const isAnswered = currentAnswers[question.id] === opt.id}
        <button
          onclick={() => answerCurrent(opt.id)}
          class="group flex items-start gap-3 rounded-xl border p-4 text-left transition
            {isAnswered
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'}"
        >
          <span
            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold
              {isAnswered
                ? 'border-emerald-500/60 text-emerald-300'
                : 'border-slate-700 text-slate-500 transition group-hover:border-indigo-500/60 group-hover:text-indigo-300'}"
          >
            {i + 1}
          </span>
          <span class="text-sm leading-relaxed text-slate-300">{opt.text}</span>
          {#if isAnswered}
            <CheckCircle2 class="ml-auto mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          {/if}
        </button>
      {/each}
    </div>

    {#if $quizIndex > 0}
      <button
        onclick={backQuestion}
        class="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
      >
        <ArrowLeft class="h-4 w-4" />
        К предыдущему кейсу
      </button>
    {/if}
  </div>
  {/key}
</div>
