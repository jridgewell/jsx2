import { diffRef } from '../../src/diff/ref';
import { createRef } from '../../src/create-ref';

describe('diffRef', () => {
  function spyableRef<R>(): { current: null | R } {
    let current: null | R = null;
    const ref = {};
    Object.defineProperty(ref, 'current', {
      set(v: R): void {
        current = v;
      },
      get(): null | R {
        return current;
      },
      configurable: true,
      enumerable: true,
    });
    return ref as { current: null | R };
  }

  describe('new ref is function', () => {
    describe('old ref is function', () => {
      it("sets ref's current", () => {
        const old = jest.fn();
        const ref = jest.fn();
        const current = {};

        diffRef(current, old, ref);

        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });

      it("unsets old ref's current", () => {
        const old = jest.fn();
        const ref = jest.fn();
        const current = {};

        diffRef(current, old, ref);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
      });

      it('does nothing if old ref is new ref', () => {
        const ref = jest.fn();
        const current = {};

        diffRef(current, ref, ref);

        expect(ref).not.toHaveBeenCalled();
      });
    });

    describe('old ref is object', () => {
      it("sets ref's current", () => {
        const old = createRef();
        const ref = jest.fn();
        const current = {};

        diffRef(current, old, ref);

        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });

      it("unsets old ref's current", () => {
        const old = spyableRef();
        const ref = jest.fn();
        const current = {};
        const spy = jest.spyOn(old, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null);
      });
    });

    describe('old ref is null', () => {
      it("sets ref's current", () => {
        const old = null;
        const ref = jest.fn();
        const current = {};

        diffRef(current, old, ref);

        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref).toHaveBeenCalledWith(current);
      });
    });
  });

  describe('new ref is object', () => {
    describe('old ref is function', () => {
      it("sets ref's current", () => {
        const old = jest.fn();
        const ref = spyableRef();
        const current = {};
        const spy = jest.spyOn(ref, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });

      it("unsets old ref's current", () => {
        const old = jest.fn();
        const ref = createRef();
        const current = {};

        diffRef(current, old, ref);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
      });
    });

    describe('old ref is object', () => {
      it("sets ref's current", () => {
        const old = createRef();
        const ref = spyableRef();
        const current = {};
        const spy = jest.spyOn(ref, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });

      it("unsets old ref's current", () => {
        const old = spyableRef();
        const ref = createRef();
        const current = {};
        const spy = jest.spyOn(old, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null);
      });

      it('does nothing if old ref is new ref', () => {
        const ref = spyableRef();
        const current = {};
        const spy = jest.spyOn(ref, 'current', 'set');

        diffRef(current, ref, ref);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('old ref is null', () => {
      it("sets ref's current", () => {
        const old = null;
        const ref = spyableRef();
        const current = {};
        const spy = jest.spyOn(ref, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(current);
      });
    });
  });

  describe('new ref is null', () => {
    describe('old ref is function', () => {
      it("unsets old ref's current", () => {
        const old = jest.fn();
        const ref = null;
        const current = {};

        diffRef(current, old, ref);

        expect(old).toHaveBeenCalledTimes(1);
        expect(old).toHaveBeenCalledWith(null);
      });
    });

    describe('old ref is object', () => {
      it("unsets old ref's current", () => {
        const old = spyableRef();
        const ref = null;
        const current = {};
        const spy = jest.spyOn(old, 'current', 'set');

        diffRef(current, old, ref);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null);
      });
    });

    describe('old ref is null', () => {
      it('does nothing', () => {
        const ref = null;
        const current = {};

        expect(() => {
          diffRef(current, ref, ref);
        }).not.toThrow();
      });
    });
  });
});
