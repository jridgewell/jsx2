import { mark } from '../../src/diff/mark';
import { nextSibling } from '../../src/diff/next-sibling';

describe('nextSibling', () => {
  describe('single node', () => {
    it('returns the next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(next);
      mark('', node, node);

      expect(nextSibling(node)).toBe(next);
    });

    it('returns null if no next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      container.appendChild(node);
      mark('', node, node);

      expect(nextSibling(node)).toBe(null);
    });
  });

  describe('range', () => {
    it('returns the next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const end = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(end);
      container.appendChild(next);
      mark('', node, end);

      expect(nextSibling(node)).toBe(next);
    });

    it('returns null if no next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const end = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(end);
      mark('', node, end);

      expect(nextSibling(node)).toBe(null);
    });
  });
});
