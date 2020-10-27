import type { EffectState, HookState } from '../hooks';

let queuedEffects: EffectState[] = [];

function process(): void {
  const queue = queuedEffects;
  queuedEffects = [];
  applyEffects(queue);
}

const raf = (() => {
  if (typeof requestAnimationFrame === 'undefined') {
    return (): void => {
      setTimeout(process, 17);
    };
  }
  function singleRaf(): void {
    setTimeout(process);
  }
  return (): void => {
    requestAnimationFrame(singleRaf);
  };
})();

export function scheduleEffect(effect: EffectState): void {
  const length = queuedEffects.push(effect);
  if (length === 1) raf();
}

export function cleanupEffects(stateData: HookState[]): void {
  for (let i = 0; i < stateData.length; i++) {
    const state = stateData[i];
    if (!state.effect) continue;

    const { data } = state;
    const { cleanup } = data;
    data.active = false;
    if (cleanup != null) cleanup();
  }
}

export function applyEffects(effects: EffectState[]): void {
  for (let i = 0; i < effects.length; i++) {
    const { active, cleanup } = effects[i];
    if (active && cleanup != null) cleanup();
  }
  for (let i = 0; i < effects.length; i++) {
    const item = effects[i];
    const { active, effect } = item;
    if (active) item.cleanup = effect();
  }
}
