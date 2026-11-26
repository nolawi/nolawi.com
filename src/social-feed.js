let widgetScript;

function loadWidgets() {
  if (window.twttr?.widgets?.load) return Promise.resolve();
  if (widgetScript) return widgetScript;

  widgetScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(fail, 10000);
    function fail() {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('X widgets did not load.'));
    }
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.addEventListener('error', fail, { once: true });
    script.addEventListener('load', () => {
      const ready = () => {
        if (!window.twttr?.widgets?.load) return;
        clearTimeout(timeout);
        resolve();
      };
      if (window.twttr?.widgets?.load) ready();
      else window.twttr?.ready?.(ready);
    }, { once: true });
    document.head.append(script);
  }).catch(error => {
    widgetScript = undefined;
    throw error;
  });
  return widgetScript;
}

function renderTimeline(host, profile) {
  const link = document.createElement('a');
  link.className = 'twitter-timeline';
  link.href = profile.href;
  link.textContent = 'Posts by @nolawi';
  link.dataset.height = '435';
  link.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  link.dataset.dnt = 'true';
  host.replaceChildren(link);

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const frame = host.querySelector('iframe');
      if (frame && frame.offsetHeight > 0 && getComputedStyle(frame).visibility !== 'hidden') {
        clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });
    const timeout = setTimeout(() => {
      observer.disconnect();
      reject(new Error('X did not return an embed.'));
    }, 10000);
    observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'height', 'width', 'hidden'] });
    window.twttr.widgets.load(host);
  });
}

export function mountSocialFeed(feed) {
  const button = feed.querySelector('button');
  const status = feed.querySelector('[role=status]');
  const host = feed.querySelector('[data-feed-content]');
  const profile = feed.querySelector('a');

  button.hidden = false;
  button.addEventListener('click', async () => {
    if (button.getAttribute('aria-disabled') === 'true') return;
    button.setAttribute('aria-disabled', 'true');
    status.textContent = 'Loading posts from X…';

    try {
      await loadWidgets();
      await renderTimeline(host, profile);
      status.textContent = 'X timeline ready.';
      button.textContent = 'Timeline shown';
    } catch {
      host.replaceChildren();
      button.removeAttribute('aria-disabled');
      status.textContent = 'The timeline is unavailable here. Open @nolawi on X to check for posts.';
    }
  });
}
