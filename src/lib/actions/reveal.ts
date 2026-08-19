export function reveal(node: HTMLElement, opts?: { delay?: number; once?: boolean }) {
  const delay = opts?.delay ?? 0;
  const apply = () => {
    if (delay) node.style.transitionDelay = `${delay}ms`;
    node.classList.add('reveal');
  };

  if (typeof IntersectionObserver === 'undefined') return;
  apply();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          node.classList.add('is-visible');
          io.disconnect();
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  io.observe(node);

  return {
    destroy() {
      io.disconnect();
    }
  };
}