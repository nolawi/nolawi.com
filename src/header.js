const links = [
  ['Design systems', '#work'],
  ['Experience', '#experience'],
  ['Accessibility', '#lab-title'],
  ['AI work', '#ai-work'],
  ['Writing', 'writing.html'],
  ['About', 'about.html']
];

export function renderHeader(home) {
  const nav = links.map(([label, href]) => {
    const target = !home && href.startsWith('#') ? './' + href : href;
    return `<a href="${target}">${label}</a>`;
  }).join('');
  return `<header class="mast wrap">
<a class="brand" href="./"><span aria-hidden="true">np.</span> Nolawi Petros</a>
<nav aria-label="Main">${nav}</nav>
<button class="theme-switch" id="theme-toggle" type="button" role="switch" aria-checked="false" hidden>
  <span>Dark mode</span><span class="switch-track" aria-hidden="true"></span><span class="theme-status" aria-hidden="true" data-theme-status>Light</span>
</button>
</header>`;
}
