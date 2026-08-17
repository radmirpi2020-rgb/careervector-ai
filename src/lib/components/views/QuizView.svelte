<script lang="ts">
  import { ArrowLeft, CheckCircle2 } from '@lucide/svelte';
  import { answerCurrent, backQuestion, getQuestion, quizIndex, totalQuestions } from '$lib/stores/profile';

  const question = $derived(getQuestion($quizIndex));
  const progress = $derived((($quizIndex + 1) / totalQuestions) * 100);
</script>

<div class="mx-auto max-w-2xl px-4 pb-20 pt-8">
  <div class="mb-8">
    <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
      <span>Кейс {$quizIndex + 1} из {totalQuestions}</span>
      <span>Ситуационные дилеммы · {Math.round(progress)}%</span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style="width: {progress}%"></div>
    </div>
  </div>

  <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
    {#if question.context}
      <div class="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-400">{question.context}</div>
    {/if}
    <h2 class="text-lg font-semibold leading-snug text-slate-50 sm:text-xl">{question.scenario}</h2>
  </div>

  <div class="mt-5 flex flex-col gap-3">
    {#each question.options as opt}
      <button
        onclick={() => answerCurrent(opt.id)}
        class="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
      >
        <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-slate-600 transition group-hover:text-indigo-400" />
        <span class="text-sm leading-relaxed text-slate-300">{opt.text}</span>
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
