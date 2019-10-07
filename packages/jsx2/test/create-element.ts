import { createElement } from '../src/jsx2';

describe('createElement', () => {
  it('returns object with type set to type arg', () => {
    const el = createElement('div');

    expect(el).toHaveProperty('type', 'div');
    expect(el).toHaveProperty('key', null);
    expect(el).toHaveProperty('ref', null);
    expect(el).toHaveProperty('props');
  });

  it('accepts FunctionComponent as type', () => {
    function Component() {}
    const el = createElement(Component);

    expect(el).toHaveProperty('type', Component);
  });

  it('accepts ClassComponent as type', () => {
    class Component {
      render() {}
    }
    const el = createElement(Component);

    expect(el).toHaveProperty('type', Component);
  });

  it('sets constructor to undefined', () => {
    const el = createElement('div');

    expect(el).toHaveProperty('constructor', undefined);
  });

  describe('key', () => {
    it('defaults key to null if props is omitted', () => {
      const el = createElement('div');

      expect(el).toHaveProperty('key', null);
    });

    it('defaults key to null if props is null', () => {
      const el = createElement('div', null);

      expect(el).toHaveProperty('key', null);
    });

    it('defaults key to null if props does not contain key', () => {
      const el = createElement('div', {});

      expect(el).toHaveProperty('key', null);
    });

    it('extracts key from props', () => {
      const key = 'key';
      const el = createElement('div', { key });

      expect(el).toHaveProperty('key', key);
      expect(el.props).not.toHaveProperty('key');
    });
  });

  describe('ref', () => {
    it('defaults ref to null if props is omitted', () => {
      const el = createElement('div');

      expect(el).toHaveProperty('ref', null);
    });

    it('defaults ref to null if props is null', () => {
      const el = createElement('div', null);

      expect(el).toHaveProperty('ref', null);
    });

    it('defaults ref to null if props does not contain ref', () => {
      const el = createElement('div', {});

      expect(el).toHaveProperty('ref', null);
    });

    it('extracts ref from props', () => {
      const ref = () => {};
      const el = createElement('div', { ref });

      expect(el).toHaveProperty('ref', ref);
      expect(el.props).not.toHaveProperty('ref');
    });
  });

  describe('props', () => {
    it('defaults props to empty object if props is omitted', () => {
      const el = createElement('div');

      expect(el).toHaveProperty('props', {});
    });

    it('defaults props to empty object if props is omitted', () => {
      const el = createElement('div', null);

      expect(el).toHaveProperty('props', {});
    });

    it('copies properties from props', () => {
      const a = {};
      const b = 1;
      const props = { a, b };
      const el = createElement('div', props);

      expect(el).toHaveProperty('props', props);
    });

    it('makes a copy of props', () => {
      const a = {};
      const b = 1;
      const props = { a, b };
      const el = createElement('div', props);

      expect(el.props).not.toBe(props);
    });
  });

  describe('children', () => {
    it('does not set children if no children', () => {
      const el = createElement('div', null);

      expect(el.props).not.toHaveProperty('children');
    });

    it('sets single child as props children', () => {
      const el = createElement('div', null, 1);

      expect(el.props).toHaveProperty('children', 1);
    });

    it('sets multiple children as props children', () => {
      const el = createElement('div', null, 1, 2);

      expect(el.props).toHaveProperty('children', [1, 2]);
    });

    it('does not mutate props arg with children', () => {
      const props = {};
      const el = createElement('div', props, 1);

      expect(props).not.toHaveProperty('children');
      expect(el.props).toHaveProperty('children', 1);
    });

    it('preserves children from props if no static children', () => {
      const children = {};
      const props = { children };
      const el = createElement('div', props);

      expect(el.props).toHaveProperty('children', children);
    });

    it('overwrites children with single child', () => {
      const props = { children: 1 };
      const el = createElement('div', props, 2);

      expect(el.props).toHaveProperty('children', 2);
    });

    it('overwrites children with multiple children', () => {
      const props = { children: 1 };
      const el = createElement('div', props, 2, 3);

      expect(el.props).toHaveProperty('children', [2, 3]);
    });
  });
});
