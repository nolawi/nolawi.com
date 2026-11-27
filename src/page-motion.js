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
  const heroDot = document.querySelector('.hero-brand-dot');
  const headerDot = header?.querySelector('.brand-dot');
  let wasAboveHeader;
  let dotFlight;

  function updateBrandDot() {
    if (!heroDot || !headerDot) return;
    const from = heroDot.getBoundingClientRect();
    const aboveHeader = from.top <= headerHeight;
    const crossed = wasAboveHeader === false && aboveHeader;
    wasAboveHeader = aboveHeader;
    if (!aboveHeader || reducedMotion.matches) {
      dotFlight?.cancel();
      return;
    }
    if (!crossed || from.bottom < headerHeight - 32 || typeof heroDot.animate !== 'function') return;

    const to = headerDot.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'brand-dot-in-flight';
    dot.setAttribute('aria-hidden', 'true');
    Object.assign(dot.style, {
      left: `${from.x}px`, top: `${from.y}px`, width: `${from.width}px`, height: `${from.height}px`
    });
    header.toggleAttribute('data-brand-handoff', true);
    heroDot.parentElement.toggleAttribute('data-hero-dot-in-flight', true);
    document.body.append(dot);

    const x = to.x + (to.width - from.width) / 2 - from.x;
    const y = to.y + (to.height - from.height) / 2 - from.y;
    const flight = dot.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${x}px, ${y}px) scale(${to.width / from.width})`, color: 'var(--on-accent)' }
    ], { duration: 260, easing: 'cubic-bezier(.2,.75,.3,1)' });
    dotFlight = flight;
    const finish = () => {
      dot.remove();
      if (dotFlight !== flight) return;
      dotFlight = undefined;
      header.removeAttribute('data-brand-handoff');
      heroDot.parentElement.removeAttribute('data-hero-dot-in-flight');
    };
    flight.finished.then(finish, finish);
  }


  function render() {
    scheduled = false;
    const scroll = window.scrollY;
    updateBrandDot();
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
  document.querySelector('.footer .brand[href="#page-top"]')?.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== '#page-top') history.pushState(null, '', '#page-top');
    document.querySelector('#page-top')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  render();
}
