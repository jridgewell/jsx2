import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { createElement } from '../../src/create-element';
import { getNextSibling } from '../../src/fiber/get-next-sibling';
import { insert } from '../../src/fiber/insert';

describe('getNextSibling', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('with skipSelf = false', () => {
    describe('without parent', () => {
      describe('fiber without dom', () => {
        describe('without next', () => {
          describe('without children', () => {
            it('returns null', () => {
              const current = fiber('current');
              const container = document.createElement('div');
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child without dom', () => {
            it('returns null', () => {
              const current = fiber('current');
              const child = fiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child with dom', () => {
            it("returns child's dom", () => {
              const current = fiber('current');
              const child = makeElementFiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(child.dom);
            });
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without next', () => {
          describe('without children', () => {
            it("returns fiber's dom", () => {
              const current = makeElementFiber('current');
              const container = document.createElement('div');
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(current.dom);
            });
          });

          describe('child without dom', () => {
            it("returns fiber's dom", () => {
              const current = makeElementFiber('current');
              const child = fiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(current.dom);
            });
          });

          describe('child with dom', () => {
            it("returns fiber's dom", () => {
              const current = makeElementFiber('current');
              const child = makeElementFiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, false);

              expect(nextSibling).toBe(current.dom);
            });
          });
        });
      });
    });

    describe('with parent inside same container', () => {
      describe('without parent.next', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });

      describe('parent.next without dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });

      describe('parent.next with dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });
    });

    describe('with parent that is the container', () => {
      describe('without parent.next', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });

      describe('parent.next without dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });

      describe('parent.next with dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns child's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(child.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child without dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });

            describe('child with dom', () => {
              it("returns fiber's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, false);

                expect(nextSibling).toBe(current.dom);
              });
            });
          });
        });
      });
    });
  });

  describe('with skipSelf = true', () => {
    describe('without parent', () => {
      describe('fiber without dom', () => {
        describe('without next', () => {
          describe('without children', () => {
            it('returns null', () => {
              const current = fiber('current');
              const container = document.createElement('div');
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child without dom', () => {
            it('returns null', () => {
              const current = fiber('current');
              const child = fiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child with dom', () => {
            it('returns null', () => {
              const current = fiber('current');
              const child = makeElementFiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });
        });
      });

      describe('fiber with dom', () => {
        describe('without next', () => {
          describe('without children', () => {
            it('returns null', () => {
              const current = makeElementFiber('current');
              const container = document.createElement('div');
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child without dom', () => {
            it('returns null', () => {
              const current = makeElementFiber('current');
              const child = fiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });

          describe('child with dom', () => {
            it('returns null', () => {
              const current = makeElementFiber('current');
              const child = makeElementFiber('child');
              const container = document.createElement('div');
              mark(child, current, null);
              insert(current, container, null);

              const nextSibling = getNextSibling(current, container, true);

              expect(nextSibling).toBe(null);
            });
          });
        });
      });
    });

    describe('with parent inside same container', () => {
      describe('without parent.next', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });

      describe('parent.next without dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });

      describe('parent.next with dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child without dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });

            describe('child with dom', () => {
              it("returns parent's next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(parentNext.dom);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = fiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, container, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });
    });

    describe('with parent that is the container', () => {
      describe('without parent.next', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const container = document.createElement('div');
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const container = document.createElement('div');
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = makeElementFiber('root');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, root, null);
                mark(next, root, current);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, root.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });

      describe('parent.next without dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = fiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });

      describe('parent.next without dom', () => {
        describe('fiber without dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = fiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });

        describe('fiber with dom', () => {
          describe('without next', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next without dom', () => {
            describe('without children', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child without dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });

            describe('child with dom', () => {
              it('returns null', () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = fiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(null);
              });
            });
          });

          describe('next with dom', () => {
            describe('without children', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child without dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = fiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });

            describe('child with dom', () => {
              it("returns next's dom", () => {
                const root = fiber('root');
                const parent = makeElementFiber('parent');
                const current = makeElementFiber('current');
                const next = makeElementFiber('next');
                const child = makeElementFiber('child');
                const parentNext = makeElementFiber('parentNext');
                const container = document.createElement('div');
                mark(child, current, null);
                mark(current, parent, null);
                mark(next, parent, current);
                mark(parent, root, null);
                mark(parentNext, root, parent);
                insert(root, container, null);

                const nextSibling = getNextSibling(current, parent.dom!, true);

                expect(nextSibling).toBe(next.dom);
              });
            });
          });
        });
      });
    });
  });
});
