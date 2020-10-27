import type { RefWork } from '../../src/diff/ref';

import { applyRefs, deferRef } from '../../src/diff/ref';
import { createRef } from '../../src/jsx2';

describe('deferRef', () => {
  describe('old ref was null', () => {
    describe('new ref is null', () => {
      it('does not add new deferred ref', () => {
        const refs: RefWork[] = [];
        const old = null;
        const ref = null;

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(0);
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = null;
        const ref = () => {};

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = null;
        const ref = createRef();

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });
  });

  describe('old ref was function', () => {
    describe('new ref is null', () => {
      it('adds new deferred ref', () => {
        const refs: RefWork[] = [];
        const old = () => {};
        const ref = null;

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref if new function', () => {
        const refs: RefWork[] = [];
        const old = () => {};
        const ref = () => {};

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });

      it('does not add new deferred ref if same function', () => {
        const refs: RefWork[] = [];
        const old = () => {};
        const ref = old;

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(0);
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = () => {};
        const ref = createRef();

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });
  });

  describe('old ref was object', () => {
    describe('new ref is null', () => {
      it('adds new deferred ref', () => {
        const refs: RefWork[] = [];
        const old = createRef();
        const ref = null;

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = createRef();
        const ref = () => {};

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref if new object', () => {
        const refs: RefWork[] = [];
        const old = createRef();
        const ref = createRef();

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(1);
      });

      it('does not add new deferred ref if same object', () => {
        const refs: RefWork[] = [];
        const old = createRef();
        const ref = old;

        deferRef(refs, {}, old, ref);

        expect(refs).toHaveLength(0);
      });
    });
  });
});

describe('applyRefs', () => {
  type SpyableRef<R> = { ref: { current: null | R }; spy: jest.SpyInstance };
  function spyableRef<R>(): SpyableRef<R> {
    let current: null | R = null;
    const ref = {
      get current(): any {
        return current;
      },
      set current(v: any) {
        current = v;
      },
    };

    return {
      ref,
      spy: jest.spyOn(ref, 'current', 'set'),
    };
  }

  describe('old ref was null', () => {
    describe('new ref is null', () => {
      it('does nothing', () => {
        const refs: RefWork[] = [];
        const old = null;
        const ref = null;
        const current = {};

        deferRef(refs, current, old, ref);

        expect(() => applyRefs(refs)).not.toThrow();
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = null;
        const ref = jest.fn();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = null;
        const { ref, spy } = spyableRef();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });
    });
  });

  describe('old ref was function', () => {
    describe('new ref is null', () => {
      it('adds new deferred ref', () => {
        const refs: RefWork[] = [];
        const old = jest.fn();
        const ref = null;
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref if new function', () => {
        const refs: RefWork[] = [];
        const old = jest.fn();
        const ref = jest.fn();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });

      it('does not add new deferred ref if same function', () => {
        const refs: RefWork[] = [];
        const old = jest.fn();
        const ref = old;
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(ref).not.toHaveBeenCalled();
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const old = jest.fn();
        const { ref, spy } = spyableRef();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });
    });
  });

  describe('old ref was object', () => {
    describe('new ref is null', () => {
      it('adds new deferred ref', () => {
        const refs: RefWork[] = [];
        const { ref: old, spy: oldSpy } = spyableRef();
        const ref = null;
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(oldSpy).toHaveBeenCalledTimes(1);
        expect(oldSpy).toHaveBeenCalledWith(null);
      });
    });

    describe('new ref is function', () => {
      it('adds deferred ref', () => {
        const refs: RefWork[] = [];
        const { ref: old, spy: oldSpy } = spyableRef();
        const ref = jest.fn();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(oldSpy).toHaveBeenCalledTimes(1);
        expect(oldSpy).toHaveBeenCalledWith(null);
        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });
    });

    describe('new ref is object', () => {
      it('adds deferred ref if new object', () => {
        const refs: RefWork[] = [];
        const { ref: old, spy: oldSpy } = spyableRef();
        const { ref, spy } = spyableRef();
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(oldSpy).toHaveBeenCalledTimes(1);
        expect(oldSpy).toHaveBeenCalledWith(null);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });

      it('does not add new deferred ref if same object', () => {
        const refs: RefWork[] = [];
        const { ref: old, spy: oldSpy } = spyableRef();
        const ref = old;
        const current = {};

        deferRef(refs, current, old, ref);
        applyRefs(refs);

        expect(oldSpy).not.toHaveBeenCalled();
      });
    });
  });
});
