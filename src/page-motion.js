export function mountPageMotion() {
  const progress = document.querySelector('.reading-progress span');
  const backToTop = document.querySelector('.back-to-top');
  const portrait = document.querySelector('[data-parallax]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  function render() {
    scheduled = false;
    const scroll = window.scrollY;
    const available = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = available ? Math.min(1, Math.max(0, scroll / available)) : 0;
    progress?.style.setProperty('--progress', ratio);
    if (backToTop) backToTop.hidden = scroll < window.innerHeight;
    if (portrait) {
      const offset = reducedMotion.matches ? 0 : Math.min(48, Math.max(0, scroll) * 0.11);
      portrait.style.setProperty('--portrait-offset', offset + 'px');
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    document.querySelector('#page-top')?.focus();
  });
  render();
}
