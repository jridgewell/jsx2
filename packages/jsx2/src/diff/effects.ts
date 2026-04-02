import type { EffectData, HookState, LayoutEffectData } from '../hooks';

import { getCurrentFiberState } from './render-component-with-hooks';
import { HookType } from '../hooks';
import { cleanupContext } from '../signals';

let queuedEffects: EffectData[] = [];
let scheduling = true;

export function scheduleEffect(effect: EffectData, scheduler = getRaf()): void {
  if (effect.scheduled) return;
  effect.scheduled = true;
  const length = queuedEffects.push(effect);
  if (length === 1 && scheduling) scheduler(process);
}

export function scheduleLayoutEffect(effect: LayoutEffectData): void {
  if (effect.scheduled) return;
  effect.scheduled = true;
  getCurrentFiberState().layoutEffects.push(effect);
}

export function cleanupEffects(stateData: HookState[]): void {
  for (let i = 0; i < stateData.length; i++) {
    const state = stateData[i];
    if (state.type === HookType.EFFECT || state.type === HookType.LAYOUT_EFFECT) {
      const { data } = state;
      const { cleanup } = data;
      data.active = false;
      if (cleanup != null) cleanup();
      if (state.type === HookType.EFFECT) {
        cleanupContext((data as EffectData).context);
      }
    }
  }
}

export function applyEffects(effects: LayoutEffectData[]): void {
  for (let i = 0; i < effects.length; i++) {
    const { active, cleanup } = effects[i];
    if (active && cleanup != null) cleanup();
  }
  for (let i = 0; i < effects.length; i++) {
    const item = effects[i];
    const { active, effect } = item;
    if (active) item.cleanup = effect();
    item.scheduled = false;
  }
}

export function process(): boolean {
  if (queuedEffects.length === 0) return false;
  const queue = queuedEffects;
  queuedEffects = [];
  applyEffects(queue);
  return true;
}

export function skipScheduling(skip: boolean): void {
  scheduling = !skip;
}

// istanbul ignore next
function getRaf(): (process: () => void) => void {
  if (typeof requestAnimationFrame === 'undefined') {
    return setTimeoutRaf;
  }
  return doubleRaf;
}

// istanbul ignore next
function setTimeoutRaf(_process: () => void) {
  setTimeout(process, 17);
}
// istanbul ignore next
function singleRaf() {
  setTimeout(process, 0);
}
// istanbul ignore next
function doubleRaf(_process: () => void) {
  requestAnimationFrame(singleRaf);
}
