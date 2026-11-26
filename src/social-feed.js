let widgetScript;

function loadWidgets() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr.widgets);
  if (widgetScript) return widgetScript;

  widgetScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => fail(new Error('X widget did not finish loading.')), 10000);
    function fail(error) {
      clearTimeout(timeout);
      script.remove();
      reject(error);
    }
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.addEventListener('error', () => fail(new Error('X widget script was unavailable.')), { once: true });
    script.addEventListener('load', () => {
      clearTimeout(timeout);
      const widgets = window.twttr?.widgets;
      if (widgets) resolve(widgets);
      else fail(new Error('X widgets were unavailable.'));
    }, { once: true });
    document.head.append(script);
  }).catch(error => {
    widgetScript = undefined;
    throw error;
  });
  return widgetScript;
}

export function mountSocialFeed(feed) {
  const button = feed.querySelector('button');
  const status = feed.querySelector('[role=status]');
  const host = feed.querySelector('[data-feed-content]');
  const profile = feed.querySelector('a');
  const screenName = new URL(profile.href).pathname.replace(/^\//, '');

  button.hidden = false;
  button.addEventListener('click', async () => {
    if (button.getAttribute('aria-disabled') === 'true') return;
    button.setAttribute('aria-disabled', 'true');
    status.textContent = 'Loading posts from X…';

    try {
      const widgets = await loadWidgets();
      const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      let timeout;
      const frame = await Promise.race([
        widgets.createTimeline({ sourceType: 'profile', screenName }, host, { height: 435, theme, dnt: true }),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Timeline timed out.')), 10000); })
      ]).finally(() => clearTimeout(timeout));
      if (!frame) throw new Error('Timeline was unavailable.');

      status.textContent = 'X timeline loaded.';
      button.textContent = 'Timeline loaded';
    } catch {
      host.replaceChildren();
      button.removeAttribute('aria-disabled');
      status.textContent = 'X couldn’t load the timeline here. You can retry or open the profile directly.';
    }
  });
}
