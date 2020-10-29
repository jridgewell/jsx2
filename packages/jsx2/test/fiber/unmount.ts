import type { Fiber } from '../../src/fiber';
import { fiber } from '../../src/fiber';
import { createElement, Component } from '../../src/jsx2';
import { mark } from '../../src/fiber/mark';
import { unmount } from '../../src/fiber/unmount';

describe('unmount', () => {
  class C extends Component {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  describe('refs', () => {
    describe('fiber without ref', () => {
      describe('fiber without dom', () => {
        describe('without children', () => {
          it('does nothing', () => {
            const parent = fiber('parent');
            const current = fiber('current');
            const next = makeElementFiber('next');
            next.ref = jest.fn();
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(next.ref).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("unmounts child's ref", () => {
            const parent = fiber('parent');
            const current = fiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            child.ref = jest.fn();
            next.ref = jest.fn();
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(child.ref).toHaveBeenCalledTimes(1);
            expect(child.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without children', () => {
          it('does nothing', () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const next = makeElementFiber('next');
            next.ref = jest.fn();
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(next.ref).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("unmounts child's ref", () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            child.ref = jest.fn();
            next.ref = jest.fn();
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(child.ref).toHaveBeenCalledTimes(1);
            expect(child.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('fiber with ref', () => {
      describe('fiber without dom', () => {
        describe('without children', () => {
          it('unmounts ref', () => {
            const parent = fiber('parent');
            const current = makeComponentFiber();
            const next = makeElementFiber('next');
            current.ref = jest.fn();
            next.ref = jest.fn();
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(current.ref).toHaveBeenCalledTimes(1);
            expect(current.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("unmounts child's ref", () => {
            const parent = fiber('parent');
            const current = makeComponentFiber();
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            current.ref = jest.fn();
            child.ref = jest.fn();
            next.ref = jest.fn();
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(current.ref).toHaveBeenCalledTimes(1);
            expect(current.ref).toHaveBeenCalledWith(null);
            expect(child.ref).toHaveBeenCalledTimes(1);
            expect(child.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without children', () => {
          it('unmounts ref', () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const next = makeElementFiber('next');
            current.ref = jest.fn();
            next.ref = jest.fn();
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(current.ref).toHaveBeenCalledTimes(1);
            expect(current.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("unmounts child's ref", () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            current.ref = jest.fn();
            child.ref = jest.fn();
            next.ref = jest.fn();
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(current.ref).toHaveBeenCalledTimes(1);
            expect(current.ref).toHaveBeenCalledWith(null);
            expect(child.ref).toHaveBeenCalledTimes(1);
            expect(child.ref).toHaveBeenCalledWith(null);
            expect(next.ref).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('pending useEffects', () => {
    function addEffect(fiber: Fiber): jest.Mock {
      const cleanup = jest.fn();
      fiber.stateData = [
        {
          effect: true,
          data: {
            deps: [],
            active: true,
            effect: () => {},
            cleanup,
          },
        },
      ];
      return cleanup;
    }

    describe('fiber without useEffect', () => {
      describe('fiber without dom', () => {
        describe('without children', () => {
          it('does nothing', () => {
            const parent = fiber('parent');
            const current = fiber('current');
            const next = makeElementFiber('next');
            const nextCleanup = addEffect(next);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("cleans child's effect", () => {
            const parent = fiber('parent');
            const current = fiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            const childCleanup = addEffect(child);
            const nextCleanup = addEffect(next);
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(childCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without children', () => {
          it('does nothing', () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const next = makeElementFiber('next');
            const nextCleanup = addEffect(next);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("cleans child's effect", () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            const childCleanup = addEffect(child);
            const nextCleanup = addEffect(next);
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(childCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('fiber with useEffect', () => {
      describe('fiber without dom', () => {
        describe('without children', () => {
          it('cleans effect', () => {
            const parent = fiber('parent');
            const current = makeComponentFiber();
            const next = makeElementFiber('next');
            const currentCleanup = addEffect(current);
            const nextCleanup = addEffect(next);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(currentCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("cleans child's effect", () => {
            const parent = fiber('parent');
            const current = makeComponentFiber();
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            const currentCleanup = addEffect(current);
            const childCleanup = addEffect(child);
            const nextCleanup = addEffect(next);
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(currentCleanup).toHaveBeenCalledTimes(1);
            expect(childCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without children', () => {
          it('cleans effect', () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const next = makeElementFiber('next');
            const currentCleanup = addEffect(current);
            const nextCleanup = addEffect(next);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(currentCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });

        describe('with child', () => {
          it("cleans child's effect", () => {
            const parent = fiber('parent');
            const current = makeElementFiber('current');
            const child = makeElementFiber('child');
            const next = makeElementFiber('next');
            const currentCleanup = addEffect(current);
            const childCleanup = addEffect(child);
            const nextCleanup = addEffect(next);
            mark(child, current, null);
            mark(current, parent, null);
            mark(next, parent, current);

            unmount(current);

            expect(currentCleanup).toHaveBeenCalledTimes(1);
            expect(childCleanup).toHaveBeenCalledTimes(1);
            expect(nextCleanup).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
