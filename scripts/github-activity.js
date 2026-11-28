import { readFileSync } from 'node:fs';

function readActivity(...files) {
  return files.flatMap(file => {
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
}

export function renderGitHubActivity() {
  const activity = readActivity('github-activity-latest.json', 'github-activity.json');
  const gitlab = readActivity('gitlab-activity-latest.json');
  const calendar = activity ? renderCalendar(activity) : '';
  return profileCard('github-activity-title', '<a href="https://github.com/nolawi#js-contribution-activity">GitHub contributions</a>', `
<p class="code-membership">Member since <time datetime="2012-05-16">2012</time></p>
${calendar}
<p class="code-history"><a href="https://github.com/nolawi/anchor-target">anchor-target</a> <span>· 2015</span> <a href="delano.html">Delano project</a></p>`) +
    profileCard('gitlab-activity-title', '<a href="https://gitlab.com/nolawi">GitLab</a>', `
<p class="code-membership">Member since <time datetime="2017-02-14">2017</time></p>
${gitlab ? renderCalendar(gitlab) : '<p class="code-history">Public contribution data is unavailable.</p>'}`);
}

export function profileCard(id, title, body, action = '') {
  return `<section class="system-card profile-card" aria-labelledby="${id}">
<header class="profile-card-heading"><h3 id="${id}">${title}</h3>${action}</header>
${body}
</section>`;
}

function renderCalendar(activity) {
  const activeDays = activity.levels.filter(level => level > 0).length;
  const through = new Date(activity.through + 'T00:00:00Z');
  const endLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  }).format(through);
  return `<figure class="github-activity">
<figcaption><strong>${activeDays} active days</strong> in the last 13 weeks
<span>Through <time datetime="${activity.through}">${endLabel}</time></span></figcaption>
<div class="github-calendar" aria-hidden="true">${activity.levels.map(level => `<span data-level="${level}"></span>`).join('')}</div>
<p class="github-legend" aria-hidden="true">Less <span data-level="0"></span><span data-level="1"></span><span data-level="2"></span><span data-level="3"></span><span data-level="4"></span> More</p>
</figure>`;
}
