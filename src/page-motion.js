export function mountPageMotion() {
  const progress = document.querySelector('.reading-progress span');
  const backToTop = document.querySelector('.back-to-top');
  const header = document.querySelector('.site-header');
  const sections = [...document.querySelectorAll('.mast nav a[href^="#"]')]
    .map(link => [link, document.getElementById(link.hash.slice(1))])
    .filter(([, section]) => section);
  let headerHeight = 0;
  const portrait = document.querySelector('[data-parallax]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  function render() {
    scheduled = false;
    const scroll = window.scrollY;
    const atBottom = scroll > 0 && scroll + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const active = atBottom ? sections.at(-1)?.[0] : sections.reduce((current, pair) => {
      const top = pair[1].getBoundingClientRect().top;
      return top <= headerHeight + 48 && top >= current.top ? { link: pair[0], top } : current;
    }, { link: null, top: -Infinity }).link;
    for (const [link] of sections) {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
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

  if (header) {
    const measure = () => {
      headerHeight = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--sticky-header-height', headerHeight + 'px');
      schedule();
    };
    new ResizeObserver(measure).observe(header);
    measure();
    document.addEventListener('focusin', ({ target }) => {
      if (header.contains(target) || target.matches('.skip, #page-top, dialog, dialog *')) return;
      const top = target.getBoundingClientRect().top;
      if (top >= 0 && top < headerHeight && window.scrollY > 0) {
        window.scrollBy({ top: top - headerHeight - 12, behavior: 'instant' });
      }
    });
  }
  window.addEventListener('hashchange', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    document.querySelector('#page-top')?.focus();
  });
  render();
}
