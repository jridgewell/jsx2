import { fiber } from '../../src/fiber';
import { createElement } from '../../src/jsx2';
import { insert } from '../../src/fiber/insert';
import { mark } from '../../src/fiber/mark';

describe('insert', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  function makeTextFiber(text: string) {
    const f = fiber(text);
    f.dom = document.createTextNode(text);
    return f;
  }

  describe('with null before', () => {
    describe('with empty container', () => {
      describe('root fiber without dom', () => {
        describe('without children', () => {
          it('does not mount', () => {
            const root = fiber('root');
            const container = document.createElement('div');

            insert(root, container, null);

            expect(container.firstChild).toBe(null);
          });
        });

        describe('with children', () => {
          it('does not mount child without dom', () => {
            const root = fiber('root');
            const child = fiber('child');
            const container = document.createElement('div');
            mark(child, root, null);

            insert(root, container, null);

            expect(container.firstChild).toBe(null);
          });

          it('mounts child with dom', () => {
            const root = fiber('root');
            const child = makeTextFiber('child');
            const container = document.createElement('div');
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([child.dom]);
          });

          it('mounts multiple children with dom', () => {
            const root = fiber('root');
            const child1 = makeTextFiber('child1');
            const child2 = makeTextFiber('child2');
            const container = document.createElement('div');
            mark(child1, root, null);
            mark(child2, root, child1);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([child1.dom, child2.dom]);
          });

          it('mounts multiple children with dom, skipping those without', () => {
            const root = fiber('root');
            const child1 = fiber('child1');
            const child2 = makeTextFiber('child2');
            const child3 = fiber('child3');
            const child4 = makeTextFiber('child4');
            const container = document.createElement('div');
            mark(child1, root, null);
            mark(child2, root, child1);
            mark(child3, root, child2);
            mark(child4, root, child3);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([child2.dom, child4.dom]);
          });
        });
      });

      describe('root fiber with dom', () => {
        describe('without children', () => {
          it('mounts text', () => {
            const root = makeTextFiber('root');
            const container = document.createElement('div');

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
          });

          it('mounts element', () => {
            const root = makeElementFiber('root');
            const container = document.createElement('div');

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
          });
        });

        describe('with children', () => {
          it('does not mount child without dom', () => {
            const root = makeElementFiber('root');
            const child = fiber('child');
            const container = document.createElement('div');
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
            expect(root.dom!.firstChild).toBe(null);
          });

          it('mounts child with dom inside root dom', () => {
            const root = makeElementFiber('root');
            const child = makeTextFiber('child');
            const container = document.createElement('div');
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child.dom]);
          });

          it('mounts multiple children with dom inside root dom', () => {
            const root = makeElementFiber('root');
            const child1 = makeTextFiber('child1');
            const child2 = makeTextFiber('child2');
            const container = document.createElement('div');
            mark(child1, root, null);
            mark(child2, root, child1);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child1.dom, child2.dom]);
          });

          it('mounts multiple children with dom, skipping those without, inside root dom', () => {
            const root = makeElementFiber('root');
            const child1 = fiber('child1');
            const child2 = makeTextFiber('child2');
            const child3 = fiber('child3');
            const child4 = makeTextFiber('child4');
            const container = document.createElement('div');
            mark(child1, root, null);
            mark(child2, root, child1);
            mark(child3, root, child2);
            mark(child4, root, child3);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child2.dom, child4.dom]);
          });
        });
      });
    });

    describe('with non-empty container', () => {
      describe('root fiber without dom', () => {
        describe('without children', () => {
          it('does not mount', () => {
            const root = fiber('root');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted]);
          });
        });

        describe('with children', () => {
          it('does not mount child without dom', () => {
            const root = fiber('root');
            const child = fiber('child');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted]);
          });

          it('mounts child with dom', () => {
            const root = fiber('root');
            const child = makeTextFiber('child');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, child.dom]);
          });

          it('mounts multiple children with dom', () => {
            const root = fiber('root');
            const child1 = makeTextFiber('child1');
            const child2 = makeTextFiber('child2');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child1, root, null);
            mark(child2, root, child1);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, child1.dom, child2.dom]);
          });

          it('mounts multiple children with dom, skipping those without', () => {
            const root = fiber('root');
            const child1 = fiber('child1');
            const child2 = makeTextFiber('child2');
            const child3 = fiber('child3');
            const child4 = makeTextFiber('child4');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child1, root, null);
            mark(child2, root, child1);
            mark(child3, root, child2);
            mark(child4, root, child3);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, child2.dom, child4.dom]);
          });
        });
      });

      describe('root fiber with dom', () => {
        describe('without children', () => {
          it('mounts text', () => {
            const root = makeTextFiber('root');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
          });

          it('mounts element', () => {
            const root = makeElementFiber('root');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
          });
        });

        describe('with children', () => {
          it('does not mount child without dom', () => {
            const root = makeElementFiber('root');
            const child = fiber('child');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
            expect(root.dom!.firstChild).toBe(null);
          });

          it('mounts child with dom inside root dom', () => {
            const root = makeElementFiber('root');
            const child = makeTextFiber('child');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child, root, null);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child.dom]);
          });

          it('mounts multiple children with dom inside root dom', () => {
            const root = makeElementFiber('root');
            const child1 = makeTextFiber('child1');
            const child2 = makeTextFiber('child2');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child1, root, null);
            mark(child2, root, child1);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child1.dom, child2.dom]);
          });

          it('mounts multiple children with dom, skipping those without, inside root dom', () => {
            const root = makeElementFiber('root');
            const child1 = fiber('child1');
            const child2 = makeTextFiber('child2');
            const child3 = fiber('child3');
            const child4 = makeTextFiber('child4');
            const container = document.createElement('div');
            const inserted = container.appendChild(document.createTextNode('inserted'));
            mark(child1, root, null);
            mark(child2, root, child1);
            mark(child3, root, child2);
            mark(child4, root, child3);

            insert(root, container, null);

            expect(Array.from(container.childNodes)).toEqual([inserted, root.dom]);
            expect(Array.from(root.dom!.childNodes)).toEqual([child2.dom, child4.dom]);
          });
        });
      });
    });
  });

  describe('with before node', () => {
    describe('root fiber without dom', () => {
      describe('without children', () => {
        it('does not mount', () => {
          const root = fiber('root');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([inserted]);
        });
      });

      describe('with children', () => {
        it('does not mount child without dom', () => {
          const root = fiber('root');
          const child = fiber('child');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child, root, null);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([inserted]);
        });

        it('mounts child with dom', () => {
          const root = fiber('root');
          const child = makeTextFiber('child');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child, root, null);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([child.dom, inserted]);
        });

        it('mounts multiple children with dom', () => {
          const root = fiber('root');
          const child1 = makeTextFiber('child1');
          const child2 = makeTextFiber('child2');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child1, root, null);
          mark(child2, root, child1);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([child1.dom, child2.dom, inserted]);
        });

        it('mounts multiple children with dom, skipping those without', () => {
          const root = fiber('root');
          const child1 = fiber('child1');
          const child2 = makeTextFiber('child2');
          const child3 = fiber('child3');
          const child4 = makeTextFiber('child4');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child1, root, null);
          mark(child2, root, child1);
          mark(child3, root, child2);
          mark(child4, root, child3);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([child2.dom, child4.dom, inserted]);
        });
      });
    });

    describe('root fiber with dom', () => {
      describe('without children', () => {
        it('mounts text', () => {
          const root = makeTextFiber('root');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
        });

        it('mounts element', () => {
          const root = makeElementFiber('root');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
        });
      });

      describe('with children', () => {
        it('does not mount child without dom', () => {
          const root = makeElementFiber('root');
          const child = fiber('child');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child, root, null);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
          expect(root.dom!.firstChild).toBe(null);
        });

        it('mounts child with dom inside root dom', () => {
          const root = makeElementFiber('root');
          const child = makeTextFiber('child');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child, root, null);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
          expect(Array.from(root.dom!.childNodes)).toEqual([child.dom]);
        });

        it('mounts multiple children with dom inside root dom', () => {
          const root = makeElementFiber('root');
          const child1 = makeTextFiber('child1');
          const child2 = makeTextFiber('child2');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child1, root, null);
          mark(child2, root, child1);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
          expect(Array.from(root.dom!.childNodes)).toEqual([child1.dom, child2.dom]);
        });

        it('mounts multiple children with dom, skipping those without, inside root dom', () => {
          const root = makeElementFiber('root');
          const child1 = fiber('child1');
          const child2 = makeTextFiber('child2');
          const child3 = fiber('child3');
          const child4 = makeTextFiber('child4');
          const container = document.createElement('div');
          const inserted = container.appendChild(document.createTextNode('inserted'));
          mark(child1, root, null);
          mark(child2, root, child1);
          mark(child3, root, child2);
          mark(child4, root, child3);

          insert(root, container, inserted);

          expect(Array.from(container.childNodes)).toEqual([root.dom, inserted]);
          expect(Array.from(root.dom!.childNodes)).toEqual([child2.dom, child4.dom]);
        });
      });
    });
  });
});
