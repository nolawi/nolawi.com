const articleForm = document.querySelector('#article');
const socialForm = document.querySelector('#social');
const entries = document.querySelector('#entries');
const topics = document.querySelector('#topics');
const preview = document.querySelector('#draft-preview');
const articleStatus = document.querySelector('#article-status');
let data;

async function request(action, payload) {
  const response = await fetch('/api/' + action, payload ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  } : {});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}

function render() {
  entries.replaceChildren(new Option('New article', ''), ...data.articles
    .filter(article => article.publication === 'Nolawi')
    .map(article => new Option(`${article.title} (${article.status})`, article.id)));
  topics.replaceChildren(...data.topics.map(topic => {
    const label = document.createElement('label');
    label.className = 'inline';
    const input = document.createElement('input');
    Object.assign(input, { type: 'checkbox', name: 'topics', value: topic.id });
    label.append(input, topic.label);
    return label;
  }));
  document.querySelector('#social-posts').replaceChildren(...data.socialPosts.map(post => {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = post.url;
    link.textContent = post.title;
    row.append(link);
    return row;
  }));
}

function openArticle(id) {
  articleForm.reset();
  entries.value = id;
  const article = data.articles.find(entry => entry.id === id);
  articleForm.elements.id.readOnly = Boolean(article);
  for (const key of ['title', 'id', 'format', 'date', 'description', 'body']) {
    if (article?.[key]) articleForm.elements[key].value = article[key];
  }
  articleForm.elements.featured.checked = Boolean(article?.featured);
  for (const input of topics.querySelectorAll('input')) input.checked = article?.topics.includes(input.value) ?? false;
  articleForm.querySelector('[value=draft]').disabled = article?.status === 'published';
  preview.hidden = true;
}

entries.addEventListener('change', () => openArticle(entries.value));
articleForm.elements.title.addEventListener('input', event => {
  if (articleForm.elements.id.readOnly) return;
  articleForm.elements.id.value = event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
});
document.querySelector('#preview').addEventListener('click', async () => {
  try {
    const { html } = await request('preview', { body: articleForm.elements.body.value });
    preview.srcdoc = '<!doctype html><html lang="en"><meta charset="utf-8"><style>body { font: 1rem/1.6 system-ui; padding: 1rem; }</style><body>' + html;
    preview.hidden = false;
    articleStatus.textContent = 'Draft preview ready.';
  } catch (error) {
    articleStatus.textContent = error.message;
  }
});

articleForm.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(articleForm);
  const payload = { ...Object.fromEntries(fields), topics: fields.getAll('topics'), featured: fields.has('featured') };
  const button = event.submitter;
  button.disabled = true;
  articleStatus.textContent = 'Saving…';
  try {
    const result = await request(button.value, payload);
    data = result.data;
    render();
    openArticle(payload.id);
    articleStatus.textContent = result.message;
  } catch (error) {
    articleStatus.textContent = error.message;
  } finally {
    button.disabled = button.value === 'draft' && data.articles.some(a => a.id === entries.value && a.status === 'published');
  }
});

socialForm.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#social-status');
  status.textContent = 'Updating preview…';
  try {
    const result = await request('social', Object.fromEntries(new FormData(socialForm)));
    const active = entries.value;
    data = result.data;
    const topicSelections = [...topics.querySelectorAll('input')].map(input => input.checked);
    render();
    entries.value = active;
    topics.querySelectorAll('input').forEach((input, i) => { input.checked = topicSelections[i]; });
    socialForm.reset();
    status.textContent = result.message;
  } catch (error) {
    status.textContent = error.message;
  }
});

try {
  data = await request('content');
  render();
} catch (error) {
  articleStatus.textContent = error.message;
}
