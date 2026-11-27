import { readFileSync } from 'node:fs';

export function renderGitHubActivity() {
  const activity = ['github-activity-latest.json', 'github-activity.json'].flatMap(file => {
    try {
      const data = JSON.parse(readFileSync(new URL('../content/' + file, import.meta.url), 'utf8'));
      if (/^\d{4}-\d{2}-\d{2}$/.test(data?.through) && Array.isArray(data.levels) &&
          data.levels.length >= 85 && data.levels.length <= 91 &&
          data.levels.every(level => Number.isInteger(level) && level >= 0 && level <= 4)) return [data];
    } catch {
      // Keep the profile link available if the calendar snapshot is missing or invalid.
    }
    return [];
  })[0];
  if (!activity) return '';

  const activeDays = activity.levels.filter(level => level > 0).length;
  return `<figure class="github-activity">
<figcaption><a href="https://github.com/nolawi#js-contribution-activity">GitHub contributions</a>
<span>${activeDays} active days in 13 weeks · through <time datetime="${activity.through}">${activity.through}</time></span></figcaption>
<div class="github-calendar" aria-hidden="true">${activity.levels.map(level => `<span data-level="${level}"></span>`).join('')}</div>
</figure>`;
}
