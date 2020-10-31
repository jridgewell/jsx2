import type { EffectState, HookState } from '../hooks';

let queuedEffects: EffectState[] = [];
let scheduling = true;

export function scheduleEffect(effect: EffectState, scheduler = getRaf()): void {
  const length = queuedEffects.push(effect);
  if (length === 1 && scheduling) scheduler(process);
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
