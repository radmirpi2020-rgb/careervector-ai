<script lang="ts">
  import type { SkillMatchDetail } from '$lib/engine/matching';

  let {
    details,
    size = 320
  }: {
    details: SkillMatchDetail[];
    size?: number;
  } = $props();

  let canvas: HTMLCanvasElement | undefined = $state();

  const axes = $derived.by(() => {
    const byCat = new Map<string, { name: string; req: number; user: number; demand: number }>();
    for (const d of details) {
      const cat = d.skill.category;
      const cur = byCat.get(cat) ?? { name: cat, req: 0, user: 0, demand: 0 };
      cur.req = Math.max(cur.req, d.requiredLevel);
      cur.user = Math.max(cur.user, d.userLevel ?? 0);
      cur.demand = Math.max(cur.demand, d.skill.marketDemandScore);
      byCat.set(cat, cur);
    }
    return Array.from(byCat.values())
      .sort((a, b) => b.req - a.req || b.demand - a.demand)
      .slice(0, 6);
  });

  const shortLabel = (name: string) => {
    const words = name.split(/[ /]/).filter(Boolean);
    if (words.length <= 2) return words.join(' ').toUpperCase();
    return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  };

  $effect(() => {
    const el = canvas;
    const list = axes;
    if (!el || list.length < 3) return;
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
    const N = list.length;

    const point = (value: number, index: number, radius: number) => {
      const angle = Math.PI / 2 - (2 * Math.PI * index) / N;
      return { x: cx + radius * value * Math.cos(angle), y: cy - radius * value * Math.sin(angle) };
    };

    for (let ring = 1; ring <= 4; ring++) {
      const rr = (R * ring) / 4;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const p = point(1, i % N, rr);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 4 ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    list.forEach((axis, i) => {
      const end = point(1, i, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(148,163,184,0.15)';
      ctx.stroke();
      const lp = point(1, i, R + 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(shortLabel(axis.name), lp.x, lp.y);
    });

    const draw = (get: (a: { req: number; user: number }) => number, color: string, fill: boolean) => {
      ctx.beginPath();
      list.forEach((axis, i) => {
        const p = point(get(axis) / 5, i, R);
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
    };

    draw((a) => a.req, '#34d399', false);
    draw((a) => a.user, '#818cf8', true);
  });
</script>

<div class="flex flex-col items-center">
  <canvas bind:this={canvas} style="width: {size}px; height: {size}px;"></canvas>
  <div class="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
    <span class="flex items-center gap-1.5 text-slate-300">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400"></span> Ваш уровень
    </span>
    <span class="flex items-center gap-1.5 text-slate-300">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400"></span> Требование роли
    </span>
  </div>
</div>
