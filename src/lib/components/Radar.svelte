<script lang="ts">
  import type { PsychologicalVector } from '$lib/types';

  let {
    user,
    role,
    size = 320,
    showLegend = true
  }: {
    user: PsychologicalVector;
    role?: PsychologicalVector;
    size?: number;
    showLegend?: boolean;
  } = $props();

  const LABELS = [
    { key: 'realistic', short: 'R', name: 'Прагматик' },
    { key: 'investigative', short: 'I', name: 'Исследователь' },
    { key: 'artistic', short: 'A', name: 'Творец' },
    { key: 'social', short: 'S', name: 'Коммуникатор' },
    { key: 'enterprising', short: 'E', name: 'Лидер' },
    { key: 'conventional', short: 'C', name: 'Систематизатор' }
  ] as const;

  let canvas: HTMLCanvasElement | undefined = $state();

  const norm = (p: PsychologicalVector, key: string) => {
    const keys = LABELS.map((l) => l.key);
    const sum = Math.sqrt(keys.reduce((acc, k) => acc + (p[k] as number) ** 2, 0)) || 1;
    return Math.max(0, Math.min(1, (p[key as keyof PsychologicalVector] as number) / sum));
  };

  $effect(() => {
    const el = canvas;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = size * dpr;
    el.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 44;
    ctx.clearRect(0, 0, size, size);

    const point = (value: number, index: number, radius: number) => {
      const angle = Math.PI / 2 - (2 * Math.PI * index) / LABELS.length;
      return { x: cx + radius * value * Math.cos(angle), y: cy - radius * value * Math.sin(angle) };
    };

    for (let ring = 1; ring <= 4; ring++) {
      const rr = (R * ring) / 4;
      ctx.beginPath();
      for (let i = 0; i <= LABELS.length; i++) {
        const p = point(1, i % LABELS.length, rr);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 4 ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    LABELS.forEach((label, i) => {
      const axis = point(1, i, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(axis.x, axis.y);
      ctx.strokeStyle = 'rgba(148,163,184,0.15)';
      ctx.stroke();
      const labelPos = point(1, i, R + 22);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label.short, labelPos.x, labelPos.y - 6);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10px Inter, system-ui, sans-serif';
      ctx.fillText(label.name, labelPos.x, labelPos.y + 6);
    });

    const drawPolygon = (vector: PsychologicalVector, color: string, fill: boolean) => {
      ctx.beginPath();
      LABELS.forEach((label, i) => {
        const p = point(norm(vector, label.key), i, R);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = color + '33';
        ctx.fill();
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      LABELS.forEach((label, i) => {
        const p = point(norm(vector, label.key), i, R);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    };

    if (role) drawPolygon(role, '#34d399', false);
    drawPolygon(user, '#818cf8', true);
  });
</script>

<div class="flex flex-col items-center">
  <canvas bind:this={canvas} style="width: {size}px; height: {size}px;"></canvas>
  {#if showLegend}
    <div class="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
      <span class="flex items-center gap-1.5 text-slate-300">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400"></span> Ваш профиль
      </span>
      {#if role}
        <span class="flex items-center gap-1.5 text-slate-300">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400"></span> Целевая роль
        </span>
      {/if}
    </div>
  {/if}
</div>
