import type { EffectState } from '../../src/hooks';
import type { FiberState } from '../../src/diff/render-component-with-hooks';

import { fiber } from '../../src/fiber';
import { createElement } from '../../src/jsx2';
import {
  getCurrentFiberState,
  renderComponentWithHooks,
} from '../../src/diff/render-component-with-hooks';

describe('getCurrentFiberState', () => {
  it('returns currently rendering fiber', () => {
    let fs: FiberState;
    const C = jest.fn(() => {
      fs = getCurrentFiberState();
    });
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(fs!.fiber).toBe(component);
  });
});

describe('renderComponentWithHooks', () => {
  function makeEffect(): EffectState {
    return {
      deps: [],
      cleanup: null,
      effect() {},
      active: true,
    };
  }

  it('invokes the component', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(C).toHaveBeenCalledTimes(1);
    expect(C).toHaveBeenLastCalledWith(props);
  });

  it('rerenders the component if its dirty', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    C.mockImplementationOnce(() => {
      component.dirty = true;
    });

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(C).toHaveBeenCalledTimes(2);
    expect(C).toHaveBeenNthCalledWith(1, props);
    expect(C).toHaveBeenNthCalledWith(2, props);
  });

  it('rerenders up to 25 times', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    C.mockImplementation(() => {
      component.dirty = true;
    });

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(C).toHaveBeenCalledTimes(25);
  });

  it('marks the fiber as current during render', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    const currents: boolean[] = [];
    C.mockImplementationOnce(() => {
      currents.push(component.current);
      component.dirty = true;
    }).mockImplementationOnce(() => {
      currents.push(component.current);
    });

    expect(component.current).toBe(false);
    renderComponentWithHooks(component.data.type, props, component, layoutEffects);
    expect(component.current).toBe(false);

    expect(currents).toEqual([true, true]);
  });

  it('marks the fiber as not dirty during render', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    const dirties: boolean[] = [];
    C.mockImplementationOnce(() => {
      dirties.push(component.dirty);
      component.dirty = true;
    }).mockImplementationOnce(() => {
      dirties.push(component.dirty);
    });

    expect(component.dirty).toBe(false);
    renderComponentWithHooks(component.data.type, props, component, layoutEffects);
    expect(component.dirty).toBe(false);

    expect(dirties).toEqual([false, false]);
  });

  it('resets the fiber index on every render', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    const indices: number[] = [];
    C.mockImplementationOnce(() => {
      const s = getCurrentFiberState();
      indices.push(s.index);
      s.index++;
      component.dirty = true;
    }).mockImplementationOnce(() => {
      const s = getCurrentFiberState();
      indices.push(s.index);
    });

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(indices).toEqual([0, 0]);
  });

  it('removes layoutEffects after a dirty render', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const firstEffect = makeEffect();
    const secondEffect = makeEffect();
    const thirdEffect = makeEffect();
    const layoutEffects: EffectState[] = [firstEffect];
    C.mockImplementationOnce(() => {
      layoutEffects.push(secondEffect);
      component.dirty = true;
    }).mockImplementationOnce(() => {
      layoutEffects.push(thirdEffect);
    });

    renderComponentWithHooks(component.data.type, props, component, layoutEffects);

    expect(layoutEffects).toHaveLength(2);
    expect(layoutEffects[0]).toBe(firstEffect);
    expect(layoutEffects[1]).toBe(thirdEffect);
  });

  it('returns the final render', () => {
    const C = jest.fn();
    const component = fiber(createElement(C));
    const props = {};
    const layoutEffects: EffectState[] = [];
    C.mockImplementationOnce(() => {
      component.dirty = true;
      return 0;
    }).mockImplementationOnce(() => {
      return 1;
    });

    const renderable = renderComponentWithHooks(
      component.data.type,
      props,
      component,
      layoutEffects,
    );

    expect(renderable).toBe('1');
  });
});
