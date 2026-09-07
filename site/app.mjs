import { effects } from './effects.mjs';

const githubRoot = 'https://github.com/XinqiBao/ao3-effects-toolkit/blob/main/effects';
const effectsById = new Map(effects.map((effect) => [effect.id, effect]));
const effectList = document.querySelector('.effect-list');
const effectSelect = document.querySelector('#effect-select');
const effectCount = document.querySelector('#effect-count');
const previewFrame = document.querySelector('#effect-preview');
const guideLink = document.querySelector('#guide-link');
const htmlLink = document.querySelector('#html-link');
const cssLink = document.querySelector('#css-link');

function buildEffectNavigation() {
  effects.forEach((effect, index) => {
    const number = String(index + 1).padStart(2, '0');
    const option = document.createElement('option');
    option.value = effect.id;
    option.textContent = effect.name;
    effectSelect.append(option);

    const button = document.createElement('button');
    button.className = 'effect-option';
    button.type = 'button';
    button.dataset.effect = effect.id;

    const numberLabel = document.createElement('span');
    numberLabel.className = 'effect-option__number';
    numberLabel.textContent = number;

    const copy = document.createElement('span');
    const name = document.createElement('strong');
    const summary = document.createElement('small');
    name.textContent = effect.name;
    summary.textContent = effect.summary;
    copy.append(name, summary);
    button.append(numberLabel, copy);
    effectList.append(button);
  });

  effectCount.textContent = String(effects.length).padStart(2, '0');
}

function selectEffect(effectName, updateHash = true) {
  const effect = effectsById.get(effectName);

  if (!effect) {
    return;
  }

  document.querySelectorAll('[data-effect]').forEach((button) => {
    const active = button.dataset.effect === effectName;
    button.classList.toggle('is-active', active);
    button.toggleAttribute('aria-current', active);
  });

  effectSelect.value = effectName;
  if (previewFrame.dataset.effect !== effectName) {
    const previewUrl = new URL(`./effects/${effectName}/preview.html`, window.location.href);
    previewFrame.contentWindow.location.replace(previewUrl.href);
    previewFrame.dataset.effect = effectName;
  }
  previewFrame.title = `${effect.name} interactive preview`;
  guideLink.href = `${githubRoot}/${effectName}/guide.md`;
  htmlLink.href = `${githubRoot}/${effectName}/example.html`;
  cssLink.href = `${githubRoot}/${effectName}/work-skin.css`;
  document.title = `${effect.name} | AO3 Effects Toolkit`;

  if (updateHash && window.location.hash !== `#${effectName}`) {
    window.history.pushState(null, '', `#${effectName}`);
  }
}

buildEffectNavigation();

effectList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-effect]');

  if (button) {
    selectEffect(button.dataset.effect);
  }
});

effectSelect.addEventListener('change', () => selectEffect(effectSelect.value));

window.addEventListener('hashchange', () => {
  const requestedEffect = window.location.hash.slice(1);
  selectEffect(effectsById.has(requestedEffect) ? requestedEffect : effects[0].id, false);
});

const initialEffect = window.location.hash.slice(1);
selectEffect(effectsById.has(initialEffect) ? initialEffect : effects[0].id, false);
