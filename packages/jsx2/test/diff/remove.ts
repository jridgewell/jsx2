import { mark } from '../../src/diff/mark';
import { remove } from '../../src/diff/remove';

describe('remove', () => {
  describe('single node', () => {
    it('removes the node', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(next);
      mark('', node, node);

      remove(node);

      expect(node.parentNode).toBe(null);
    });

    it('returns the next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(next);
      mark('', node, node);

      expect(remove(node)).toBe(next);
    });

    it('returns null if no next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      container.appendChild(node);
      mark('', node, node);

      expect(remove(node)).toBe(null);
    });
  });

  describe('range', () => {
    it('removes the range', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const end = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(end);
      container.appendChild(next);
      mark('', node, end);

      remove(node);

      expect(node.parentNode).toBe(null);
      expect(end.parentNode).toBe(null);
    });

    it('returns the next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const end = document.createTextNode('');
      const next = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(end);
      container.appendChild(next);
      mark('', node, end);

      expect(remove(node)).toBe(next);
    });

    it('returns null if no next sibling', () => {
      const container = document.createElement('div');
      const node = document.createTextNode('');
      const end = document.createTextNode('');
      container.appendChild(node);
      container.appendChild(end);
      mark('', node, end);

      expect(remove(node)).toBe(null);
    });
  });
});
