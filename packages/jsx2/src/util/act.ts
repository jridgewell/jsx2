import {
  process as processDiffs,
  skipScheduling as skipDiffScheduling,
} from '../diff/enqueue-diff';
import { process as processEffects, skipScheduling as skipEffectScheduling } from '../diff/effects';

let callDepth = 0;

export function act(cb: () => Promise<void | undefined>): Promise<void | undefined>;
export function act(cb: () => void | undefined): void;
export function act(
  cb: () => void | undefined | Promise<void | undefined>,
): void | Promise<void | undefined> {
  let result;
  callDepth++;
  skipDiffScheduling(true);
  skipEffectScheduling(true);
  try {
    result = cb();
  } catch (e) {
    process();
    throw e;
  }

  if (!isThenable(result)) return process();

  return result.then(process, (error) => {
    process();
    throw error;
  });
}

function process() {
  callDepth--;
  if (callDepth > 0) return;
  let diffs = false;
  let effects = false;
  do {
    diffs = processDiffs();
    effects = processEffects();
  } while (diffs || effects);
  skipDiffScheduling(false);
  skipEffectScheduling(false);
}

function isThenable(value: unknown): value is Promise<unknown> {
  return (
    value && typeof value === 'object' && typeof (value as { then?: unknown }).then === 'function'
  );
}
