import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { reorderAfter } from '../../src/fiber/reorder-after';
import { insert } from '../../src/fiber/insert';

describe('reorderAfter', () => {
  describe('when previous is null', () => {
    describe('when fiber if first child of parent', () => {
      describe('when next is null', () => {
        it('returns false', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(current, parent, null);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, null)).toBe(false);
        });

        it('keeps fiber as first child of parent', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(current, parent, null);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(parent.child).toBe(current);
        });

        it("keeps fiber's index the same", () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(current, parent, null);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.index).toBe(0);
        });

        it('keeps next fiber the same', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(current, parent, null);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.next).toBe(null);
        });
      });

      describe('when next', () => {
        it('returns false', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(current, parent, null);
          mark(next, parent, current);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, null)).toBe(false);
        });

        it('keeps fiber as first child of parent', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(current, parent, null);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(parent.child).toBe(current);
        });

        it("keeps fiber's index the same", () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(current, parent, null);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.index).toBe(0);
        });

        it('keeps next fiber the same', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(current, parent, null);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.next).toBe(next);
        });

        it("keeps next's index the same", () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(current, parent, null);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(next.index).toBe(1);
        });
      });
    });

    describe('when fiber is not first child', () => {
      describe('when next is null', () => {
        it('returns true', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, null)).toBe(true);
        });

        it('sets fiber as first child of parent', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(parent.child).toBe(current);
        });

        it("sets fiber's index to 0", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.index).toBe(0);
        });

        it('sets next as old first child', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.next).toBe(first);
        });

        it("increments old first child's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(first.index).toBe(1);
        });

        it("sets before's next as old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(before.next).toBe(null);
        });

        it("increments before's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(before.index).toBe(2);
        });
      });

      describe('when next', () => {
        it('returns true', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, null)).toBe(true);
        });

        it('sets fiber as first child of parent', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(parent.child).toBe(current);
        });

        it("sets fiber's index to 0", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.index).toBe(0);
        });

        it('sets next as old first child', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(current.next).toBe(first);
        });

        it("increments old first child's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(first.index).toBe(1);
        });

        it("sets before's next as old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(before.next).toBe(next);
        });

        it("increments before's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(before.index).toBe(2);
        });

        it("keeps next's index the same", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(before, parent, first);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, null);

          expect(next.index).toBe(3);
        });
      });
    });
  });

  describe('when previous', () => {
    describe('when fiber directly after before', () => {
      describe('when next is null', () => {
        it('returns false', () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, before)).toBe(false);
        });

        it("keeps fiber as previous's next", () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(before.next).toBe(current);
        });

        it("keeps fiber's index the same", () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(current.index).toBe(1);
        });

        it('keeps next fiber the same', () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(current.next).toBe(null);
        });
      });

      describe('when next', () => {
        it('returns false', () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, before)).toBe(false);
        });

        it("keeps fiber as previous's next", () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(before.next).toBe(current);
        });

        it("keeps fiber's index the same", () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(current.index).toBe(1);
        });

        it('keeps next fiber the same', () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(current.next).toBe(next);
        });

        it("keeps next's index the same", () => {
          const parent = fiber('parent');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(before, parent, null);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, before);

          expect(next.index).toBe(2);
        });
      });
    });

    describe('when fiber is not first child', () => {
      describe('when next is null', () => {
        it('returns true', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, first)).toBe(true);
        });

        it("sets previous's next to fiber", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(first.next).toBe(current);
        });

        it("sets fiber's index to after previous", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(current.index).toBe(1);
        });

        it("sets next to previous's old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(current.next).toBe(second);
        });

        it("increments previous's next's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(second.index).toBe(2);
        });

        it("sets before's next as old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(before.next).toBe(null);
        });

        it("increments before's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(before.index).toBe(3);
        });
      });

      describe('when next', () => {
        it('returns true', () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          expect(reorderAfter(current, parent, first)).toBe(true);
        });

        it("sets previous's next to fiber", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(first.next).toBe(current);
        });

        it("sets fiber's index to after previous", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(current.index).toBe(1);
        });

        it("sets next to previous's old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(current.next).toBe(second);
        });

        it("increments previous's next's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(second.index).toBe(2);
        });

        it("sets before's next as old next", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(before.next).toBe(next);
        });

        it("increments before's index", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(before.index).toBe(3);
        });

        it("keeps next's index the same", () => {
          const parent = fiber('parent');
          const first = fiber('first');
          const second = fiber('second');
          const before = fiber('before');
          const current = fiber('current');
          const next = fiber('next');
          const container = document.createElement('div');
          mark(first, parent, null);
          mark(second, parent, first);
          mark(before, parent, second);
          mark(current, parent, before);
          mark(next, parent, current);
          insert(parent, container, null);

          reorderAfter(current, parent, first);

          expect(next.index).toBe(4);
        });
      });
    });
  });
});
