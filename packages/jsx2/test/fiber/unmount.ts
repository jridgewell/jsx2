import type { ContextHolder } from '../../src/create-context';
import type { FunctionComponentFiber } from '../../src/fiber';

import { fiber } from '../../src/fiber';
import { Component, createElement } from '../../src/jsx2';
import { mark } from '../../src/fiber/mark';
import { unmount } from '../../src/fiber/unmount';

describe('unmount', () => {
  class C extends Component {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render() {}
  }

  function makeClassComponentFiber() {
    return fiber(createElement(C, null));
  }

  function makeFunctionComponentFiber() {
    return fiber(createElement(() => {}, null));
  }

  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('unmounted', () => {
    describe('without children', () => {
      it('sets fiber to unmounted', () => {
        const parent = fiber('parent');
        const current = fiber('current');
        const next = makeElementFiber('next');
        mark(current, parent, null);
        mark(next, parent, current);

        unmount(current);

        expect(current.mounted).toBe(false);
        expect(next.mounted).toBe(true);
      });
    });

    describe('with child', () => {
      it('sets child to unmounted', () => {
        const parent = fiber('parent');
        const current = fiber('current');
        const child = makeElementFiber('child');
        const next = makeElementFiber('next');
        mark(child, current, null);
        mark(current, parent, null);
        mark(next, parent, current);

        unmount(current);

        expect(child.mounted).toBe(false);
        expect(current.mounted).toBe(false);
        expect(next.mounted).toBe(true);
      });
    });
  });

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
            const current = makeClassComponentFiber();
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
            const current = makeClassComponentFiber();
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
    function addEffect(fiber: FunctionComponentFiber): jest.Mock {
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
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
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
          const child = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
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

    describe('fiber with useEffect', () => {
      describe('without children', () => {
        it('cleans effect', () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
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
          const current = makeFunctionComponentFiber();
          const child = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
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

  describe('consumed contexts', () => {
    function makeContextHolder(fiber: FunctionComponentFiber): ContextHolder<null> {
      const holder = {
        value: null,
        context: {} as any,
        consumers: [fiber],
      };
      fiber.consumedContexts = [holder];
      return holder;
    }

    describe('fiber without consumed context', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
          const nextHolder = makeContextHolder(next);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(nextHolder.consumers).toContain(next);
        });
      });

      describe('with child', () => {
        it("removes child from context's consumers", () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const child = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
          const childHolder = makeContextHolder(child);
          const nextHolder = makeContextHolder(next);
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(childHolder.consumers).not.toContain(child);
          expect(nextHolder.consumers).toContain(next);
        });
      });
    });

    describe('fiber with consumed context', () => {
      describe('without children', () => {
        it("removes fiber from context's consumers", () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
          const currentHolder = makeContextHolder(current);
          const nextHolder = makeContextHolder(next);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(currentHolder.consumers).not.toContain(current);
          expect(nextHolder.consumers).toContain(next);
        });
      });

      describe('with child', () => {
        it("cleans child's effect", () => {
          const parent = fiber('parent');
          const current = makeFunctionComponentFiber();
          const child = makeFunctionComponentFiber();
          const next = makeFunctionComponentFiber();
          const currentHolder = makeContextHolder(current);
          const childHolder = makeContextHolder(child);
          const nextHolder = makeContextHolder(next);
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(currentHolder.consumers).not.toContain(current);
          expect(childHolder.consumers).not.toContain(child);
          expect(nextHolder.consumers).toContain(next);
        });
      });
    });
  });
});
