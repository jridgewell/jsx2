import type { EffectState } from '../hooks';

let queuedEffects: EffectState[] = [];

function process(): void {
  const queue = queuedEffects;
  queuedEffects = [];
  applyEffects(queue);
}

const raf = (() => {
  if (typeof requestAnimationFrame === 'undefined') {
    return (): void => {
      setTimeout(process, 32);
    };
  }
  function singleRaf(): void {
    requestAnimationFrame(process);
  }
  return (): void => {
    requestAnimationFrame(singleRaf);
  }
})();

export function scheduleEffect(effect: EffectState): void {
  const length = queuedEffects.push(effect);
  if (length === 1) raf();
}

export function purgeInactiveEffects(): void {
  queuedEffects = queuedEffects.filter(e => e.active);
}

export function applyEffects(effects: EffectState[]): void {
  for (let i = 0; i < effects.length; i++) {
    const { cleanup } = effects[i];
    if (cleanup) cleanup();
  }
  for (let i = 0; i < effects.length; i++) {
    const item = effects[i];
    const { effect } = item;
    item.cleanup = effect();
  }
}
