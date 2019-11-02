import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';

describe('mark', () => {
  describe('when previousFiber is null', () => {
    it("set fiber's parent to parentFiber", () => {
      const current = fiber('current');
      const parent = fiber('parent');
      const previous = null;

      mark(current, parent, previous);

      expect(current.parent).toBe(parent);
    });

    it('sets parent.child to current', () => {
      const current = fiber('current');
      const parent = fiber('parent');
      const previous = null;

      mark(current, parent, previous);

      expect(parent.child).toBe(current);
    });
  });

  describe('when previousFiber is not null', () => {
    it("set fiber's parent to parentFiber", () => {
      const current = fiber('current');
      const parent = fiber('parent');
      const previous = fiber('previous');

      mark(current, parent, previous);

      expect(current.parent).toBe(parent);
    });

    it('sets previousFiber.next to current', () => {
      const current = fiber('current');
      const parent = fiber('parent');
      const previous = fiber('previous');

      mark(current, parent, previous);

      expect(previous.next).toBe(current);
    });

    it('does not set parent.child to current', () => {
      const current = fiber('current');
      const parent = fiber('parent');
      const previous = fiber('previous');

      mark(current, parent, previous);

      expect(parent.child).not.toBe(previous);
    });
  });
});
