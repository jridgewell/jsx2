import { mark, markFragment, markComponent } from '../../src/diff/mark';

function isMarked(node: null | Node): boolean {
  return node !== null && Reflect.has(node, '_vnode');
}

describe('mark', () => {
  it('marks the start node', () => {
    const el = document.createElement('div');
    const renderable = 'test';

    mark(renderable, el, el);
    expect(isMarked(el)).toBe(true);
  });
});

describe('markFragment', () => {
  describe('empty frag', () => {
    it('does not mark the fragment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(isMarked(frag)).toBe(false);
    });

    it('returns the fragment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      expect(markFragment(renderable, frag)).toBe(frag);
    });

    it('inserts comment into empty frag', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(frag.firstChild).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks the comment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(isMarked(frag.firstChild)).toBe(true);
    });
  });

  describe('non-empty frag', () => {
    it('does not mark the fragment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(isMarked(frag)).toBe(false);
    });

    it('returns the fragment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      expect(markFragment(renderable, frag)).toBe(frag);
    });

    it('inserts comment as first child', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(frag.firstChild).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks the comment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markFragment(renderable, frag);
      expect(isMarked(frag.firstChild)).toBe(true);
    });
  });
});

describe('markComponent', () => {
  describe('null', () => {
    it('returns a comment', () => {
      const rendered = null;
      const renderable = 'test';

      expect(markComponent(renderable, rendered)).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks comment', () => {
      const rendered = null;
      const renderable = 'test';

      const comment = markComponent(renderable, rendered);

      expect(isMarked(comment)).toBe(true);
    });
  });

  describe('empty frag', () => {
    it('does not mark the fragment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(isMarked(frag)).toBe(false);
    });

    it('returns the fragment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      expect(markComponent(renderable, frag)).toBe(frag);
    });

    it('inserts comment into empty frag', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(frag.firstChild).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks the comment', () => {
      const frag = document.createDocumentFragment();
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(isMarked(frag.firstChild)).toBe(true);
    });
  });

  describe('non-empty frag', () => {
    it('does not mark the fragment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(isMarked(frag)).toBe(false);
    });

    it('returns the fragment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      expect(markComponent(renderable, frag)).toBe(frag);
    });

    it('inserts comment as first child', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(frag.firstChild).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks the comment', () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('test'));
      const renderable = 'test';

      markComponent(renderable, frag);
      expect(isMarked(frag.firstChild)).toBe(true);
    });
  });

  describe('text node', () => {
    it('returns a fragment', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      expect(markComponent(renderable, rendered)).toHaveProperty('nodeType', Node.DOCUMENT_FRAGMENT_NODE);
    });

    it('does not mark fragment', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      const frag = markComponent(renderable, rendered);
      expect(isMarked(frag)).toBe(false);
    });

    it('does not mark text node', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      markComponent(renderable, rendered);
      expect(isMarked(rendered)).toBe(false);
    });

    it('inserts comment as first child of fragment', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      const frag = markComponent(renderable, rendered);
      expect(frag.firstChild).toHaveProperty('nodeType', Node.COMMENT_NODE);
    });

    it('marks comment node', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      const frag = markComponent(renderable, rendered);
      expect(isMarked(frag.firstChild)).toBe(true);
    });

    it('appends text node as last child', () => {
      const rendered = document.createTextNode('test');
      const renderable = 'test';

      const frag = markComponent(renderable, rendered);
      expect(frag.lastChild).toBe(rendered);
    });
  });
});
