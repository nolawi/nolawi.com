export function renderFavicon(background, foreground) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="16" fill="${background}"/>
<text x="32" y="45" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="39" fill="${foreground}">n.</text>
</svg>`;
}

export function mountFavicon(preferences) {
  const icon = document.querySelector('link[data-theme-icon]');
  if (!icon) return;
  let currentColors;
  preferences.subscribe(() => {
    const style = getComputedStyle(document.documentElement);
    const background = style.getPropertyValue('--accent').trim();
    const foreground = style.getPropertyValue('--on-accent').trim();
    const colors = background + '/' + foreground;
    if (!background || !foreground || colors === currentColors) return;
    currentColors = colors;
    icon.href = 'data:image/svg+xml,' + encodeURIComponent(renderFavicon(background, foreground));
  });
}
