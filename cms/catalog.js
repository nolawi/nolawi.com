for (const setting of document.querySelectorAll('[data-setting]')) {
  setting.addEventListener('change', () => {
    document.documentElement.dataset[setting.dataset.setting] = setting.value;
  });
}
const dialog = document.querySelector('dialog');
const opener = document.querySelector('[data-open]');
opener.addEventListener('click', () => dialog.showModal());
dialog.addEventListener('close', () => opener.focus());
