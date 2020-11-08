import { fiber } from '../../src/fiber';
import { getPreviousFiber } from '../../src/fiber/get-previous-fiber';
import { mark } from '../../src/fiber/mark';

describe('getPreviousFiber', () => {
  it('returns null if fiber is first child', () => {
    const parent = fiber('parent');
    const current = fiber('current');
    mark(current, parent, null);

    expect(getPreviousFiber(current, parent)).toBe(null);
  });

  it('returns first child if fiber is second child', () => {
    const parent = fiber('parent');
    const current = fiber('current');
    const previous = fiber('previous');
    mark(previous, parent, null);
    mark(current, parent, previous);

    expect(getPreviousFiber(current, parent)).toBe(previous);
  });

  it('returns previous fiber', () => {
    const parent = fiber('parent');
    const current = fiber('current');
    let previous = null;
    for (let i = 0; i < 10; i++) {
      const f = fiber('' + i);
      mark(f, parent, previous);
      previous = f;
    }
    mark(current, parent, previous);

    expect(getPreviousFiber(current, parent)).toBe(previous);
  });
});
