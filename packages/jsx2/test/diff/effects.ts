import type { Effect, EffectHookState, EffectCleanup, HookState } from '../../src/hooks';

import { scheduleEffect, cleanupEffects, applyEffects } from '../../src/diff/effects';

function makeEffect(effect: Effect, cleanup?: EffectCleanup): EffectHookState {
  return {
    effect: true,
    data: {
      deps: [],
      active: true,
      cleanup,
      effect,
    },
  };
}

describe('scheduleEffect', () => {
  let process: () => void;
  function defaultScheduler(p: () => void): void {
    process = p;
  }

  afterEach(() => {
    if (process) process();
  });

  it('calls scheduler', () => {
    const effect = makeEffect(() => {}).data;
    const scheduler = jest.fn(defaultScheduler);

    scheduleEffect(effect, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it('only calls scheduler once until drained', () => {
    const scheduler = jest.fn(defaultScheduler);

    scheduleEffect(makeEffect(() => {}).data, scheduler);
    scheduleEffect(makeEffect(() => {}).data, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it('calls scheduler after draining', () => {
    const scheduler = jest.fn(defaultScheduler);

    scheduleEffect(makeEffect(() => {}).data, scheduler);
    process();
    scheduleEffect(makeEffect(() => {}).data, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(2);
  });

  it('is reentrant', () => {
    const scheduler = jest.fn(defaultScheduler);
    const first = jest.fn(() => {
      scheduleEffect(makeEffect(second).data, scheduler);
    });
    const second = jest.fn();

    scheduleEffect(makeEffect(first).data, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    process();

    expect(scheduler).toHaveBeenCalledTimes(2);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
    process();

    expect(scheduler).toHaveBeenCalledTimes(2);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe('cleanupEffects', () => {
  it('calls cleanup on effects', () => {
    const effect = jest.fn();
    const cleanup = jest.fn();
    const hooks = [makeEffect(effect, cleanup)];

    cleanupEffects(hooks);

    expect(effect).not.toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('inactivates the effect', () => {
    const hooks = [makeEffect(() => {})];

    cleanupEffects(hooks);

    expect(hooks[0].data.active).toBe(false);
  });

  it('skips non-effects', () => {
    const cleanup = jest.fn();
    const hooks: HookState[] = [
      {
        effect: false,
        data: null,
      },
      makeEffect(() => {}, cleanup),
    ];

    cleanupEffects(hooks);

    expect((hooks[1] as EffectHookState).data.active).toBe(false);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('skips effects without cleanup', () => {
    const cleanup = jest.fn();
    const hooks = [makeEffect(() => {}), makeEffect(() => {}, cleanup)];

    cleanupEffects(hooks);

    expect(hooks[0].data.active).toBe(false);
    expect(hooks[1].data.active).toBe(false);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

describe('applyEffects', () => {
  function expectCalledBefore(first: jest.Mock, second: jest.Mock) {
    expect(first.mock.invocationCallOrder[0]).toBeLessThan(second.mock.invocationCallOrder[0]);
  }

  it('calls effect fn', () => {
    const effect = jest.fn();
    const effects = [makeEffect(effect).data];

    applyEffects(effects);

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('calls cleanup of effect', () => {
    const cleanup = jest.fn();
    const effects = [makeEffect(() => {}, cleanup).data];

    applyEffects(effects);

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('skips inactive effect fn', () => {
    const effect = jest.fn();
    const effects = [makeEffect(effect).data];
    effects[0].active = false;

    applyEffects(effects);

    expect(effect).not.toHaveBeenCalled();
  });

  it('calls cleanup of effect', () => {
    const cleanup = jest.fn();
    const effects = [makeEffect(() => {}, cleanup).data];
    effects[0].active = false;

    applyEffects(effects);

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('sets cleanup to result of effect fn', () => {
    const cleanup = () => {};
    const effects = [makeEffect(() => cleanup).data];

    applyEffects(effects);

    expect(effects[0].cleanup).toBe(cleanup);
  });

  it('calls all cleanups before effect fn', () => {
    const effect = jest.fn();
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();
    const effects = [makeEffect(effect, cleanup1).data, makeEffect(() => {}, cleanup2).data];

    applyEffects(effects);

    expectCalledBefore(cleanup1, effect);
    expectCalledBefore(cleanup2, effect);
  });
});
