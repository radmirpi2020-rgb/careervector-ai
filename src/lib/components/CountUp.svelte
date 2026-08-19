<script lang="ts">
  interface Props {
    value: number;
    duration?: number;
  }

  let { value, duration = 1100 }: Props = $props();

  let root: HTMLSpanElement | undefined = $state();
  let shown = $state(0);

  $effect(() => {
    if (!root) return;
    if (typeof IntersectionObserver === 'undefined' || typeof requestAnimationFrame === 'undefined') {
      shown = value;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown = value;
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const from = 0;
        const to = value;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          shown = Math.round(from + (to - from) * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
          else shown = to;
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  });
</script>

<span bind:this={root}>{shown}</span>