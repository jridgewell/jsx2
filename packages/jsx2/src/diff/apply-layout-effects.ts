import type { EffectState } from '../hooks';

export function applyLayoutEffects(layoutEffects: EffectState[]): void {
  for (let i = 0; i < layoutEffects.length; i++) {
    const { cleanup } = layoutEffects[i];
    if (cleanup) cleanup();
  }
  for (let i = 0; i < layoutEffects.length; i++) {
    const layoutEffect = layoutEffects[i];
    const { effect } = layoutEffect;
    layoutEffect.cleanup = effect();
  }
}
