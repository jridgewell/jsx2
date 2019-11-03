import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { unmount } from '../../src/fiber/unmount';
import { createElement, Component } from '../..';

describe('unmount', () => {
  class C extends Component {
    render() {}
  }

  function makeComponentFiber() {
    return fiber(createElement(C, null));
  }

  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('fiber without ref', () => {
    describe('fiber without dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const current = fiber('current');

          expect(() => unmount(current)).not.toThrow();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const current = fiber('current');
          const child = makeElementFiber('child');
          const childRef = jest.fn();
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(childRef).toHaveBeenCalledTimes(1);
          expect(childRef).toHaveBeenCalledWith(null);
        });
      });
    });

    describe('fiber with dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const current = fiber('current');

          expect(() => unmount(current)).not.toThrow();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const current = makeElementFiber('current');
          const child = makeElementFiber('child');
          const childRef = jest.fn();
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(childRef).toHaveBeenCalledTimes(1);
          expect(childRef).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe('fiber with ref', () => {
    describe('fiber without dom', () => {
      describe('without children', () => {
        it("unmounts fiber's ref", () => {
          const current = makeComponentFiber();
          const ref = jest.fn();
          current.ref = ref;

          unmount(current);

          expect(ref).toHaveBeenCalledTimes(1);
          expect(ref).toHaveBeenCalledWith(null);
        });
      });

      describe('with child', () => {
        it("unmounts fiber's ref", () => {
          const current = makeComponentFiber();
          const child = makeElementFiber('child');
          const ref = jest.fn();
          const childRef = jest.fn();
          current.ref = ref;
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(ref).toHaveBeenCalledTimes(1);
          expect(ref).toHaveBeenCalledWith(null);
        });

        it("unmounts child's ref", () => {
          const current = makeComponentFiber();
          const child = makeElementFiber('child');
          const ref = jest.fn();
          const childRef = jest.fn();
          current.ref = ref;
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(childRef).toHaveBeenCalledTimes(1);
          expect(childRef).toHaveBeenCalledWith(null);
        });
      });
    });

    describe('fiber with dom', () => {
      describe('without children', () => {
        it("unmounts fiber's ref", () => {
          const current = makeElementFiber('current');
          const ref = jest.fn();
          current.ref = ref;

          unmount(current);

          expect(ref).toHaveBeenCalledTimes(1);
          expect(ref).toHaveBeenCalledWith(null);
        });
      });

      describe('with child', () => {
        it("unmounts fiber's ref", () => {
          const current = makeElementFiber('current');
          const child = makeElementFiber('child');
          const ref = jest.fn();
          const childRef = jest.fn();
          current.ref = ref;
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(ref).toHaveBeenCalledTimes(1);
          expect(ref).toHaveBeenCalledWith(null);
        });

        it("unmounts child's ref", () => {
          const current = makeElementFiber('current');
          const child = makeElementFiber('child');
          const ref = jest.fn();
          const childRef = jest.fn();
          current.ref = ref;
          child.ref = childRef;
          mark(child, current, null);

          unmount(current);

          expect(childRef).toHaveBeenCalledTimes(1);
          expect(childRef).toHaveBeenCalledWith(null);
        });
      });
    });
  });
});
