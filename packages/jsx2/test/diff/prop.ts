import { addListeners, addProps, diffProp, diffProps } from '../../src/diff/prop';

describe('diffProp', () => {
  describe('children', () => {
    it('does nothing', () => {
      const el = document.createElement('div');
      const prop = 'children';
      const old = null;
      const children = ['test'];

      expect(() => {
        diffProp(el, prop, old, children);
      }).not.toThrow();

      expect(el.hasAttribute('children')).toBe(false);
    });
  });

  describe('key', () => {
    it('does nothing', () => {
      const el = document.createElement('div');
      const prop = 'key';
      const old = null;
      const key = 'test';

      expect(() => {
        diffProp(el, prop, old, key);
      }).not.toThrow();

      expect(el.hasAttribute('key')).toBe(false);
    });
  });

  describe('ref', () => {
    it('does nothing', () => {
      const el = document.createElement('div');
      const prop = 'ref';
      const old = null;
      const ref = () => {};

      expect(() => {
        diffProp(el, prop, old, ref);
      }).not.toThrow();

      expect(el.hasAttribute('ref')).toBe(false);
    });
  });

  describe('class', () => {
    it('sets the className', () => {
      const el = document.createElement('div');
      const prop = 'class';
      const old = null;
      const className = 'test';

      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe(className);
    });

    it('does not reset className if old is same value', () => {
      const el = document.createElement('div');
      const prop = 'class';
      const className = 'test';

      diffProp(el, prop, null, className);
      const spy = jest.spyOn(el, 'className', 'set');
      diffProp(el, prop, className, className);

      expect(spy).not.toHaveBeenCalled();
    });

    it('unsets the className', () => {
      const el = document.createElement('div');
      const prop = 'class';
      const old = 'test';
      const className = '';

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });

    it('unsets the className with undefined', () => {
      const el = document.createElement('div');
      const prop = 'class';
      const old = 'test';
      const className = undefined;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });

    it('unsets the className with null', () => {
      const el = document.createElement('div');
      const prop = 'class';
      const old = 'test';
      const className = null;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });
  });

  describe('className', () => {
    it('sets the className', () => {
      const el = document.createElement('div');
      const prop = 'className';
      const old = null;
      const className = 'test';

      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe(className);
    });

    it('does not reset className if old is same value', () => {
      const el = document.createElement('div');
      const prop = 'className';
      const className = 'test';

      diffProp(el, prop, null, className);
      const spy = jest.spyOn(el, 'className', 'set');
      diffProp(el, prop, className, className);

      expect(spy).not.toHaveBeenCalled();
    });

    it('unsets the className', () => {
      const el = document.createElement('div');
      const prop = 'className';
      const old = 'test';
      const className = '';

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });

    it('unsets the className with undefined', () => {
      const el = document.createElement('div');
      const prop = 'className';
      const old = 'test';
      const className = undefined;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });

    it('unsets the className with null', () => {
      const el = document.createElement('div');
      const prop = 'className';
      const old = 'test';
      const className = null;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, className);

      expect(el.getAttribute('class')).toBe('');
    });
  });

  describe('dangerouslySetInnerHTML', () => {
    it('throws', () => {
      const el = document.createElement('div');
      const prop = 'dangerouslySetInnerHTML';
      const html = '<div></div>';

      expect(() => {
        diffProp(el, prop, null, html);
      }).toThrow();
    });
  });

  describe('events', () => {
    it('adds event listener', () => {
      const el = document.createElement('div');
      const prop = 'onClick';
      const listener = jest.fn();
      const event = new Event('click');

      diffProp(el, prop, null, listener);
      el.dispatchEvent(event);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(event);
    });
  });

  describe('styles', () => {
    it('sets style', () => {
      const el = document.createElement('div');
      const prop = 'style';
      const style = { background: 'black' };

      diffProp(el, prop, null, style);

      expect(el.style.background).toBe('black');
    });
  });

  describe('property of element', () => {
    it('sets the property', () => {
      const el = document.createElement('a');
      const prop = 'href';
      const old = null;
      const href = 'https://foo.com/';

      diffProp(el, prop, old, href);

      expect(el.href).toBe(href);
    });

    it('does not reset property if old is same value', () => {
      const el = document.createElement('a');
      const prop = 'href';
      const href = 'https://foo.com/';

      diffProp(el, prop, null, href);
      const spy = jest.spyOn(el, 'href', 'set');
      diffProp(el, prop, href, href);

      expect(spy).not.toHaveBeenCalled();
    });

    it('unsets the property', () => {
      const el = document.createElement('a');
      const prop = 'href';
      const old = 'https://foo.com/';
      const href = '';

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, href);

      expect(el.href).toBe('http://localhost/');
    });

    it('unsets the property with undefined', () => {
      const el = document.createElement('a');
      const prop = 'href';
      const old = 'https://foo.com/';
      const href = undefined;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, href);

      expect(el.href).toBe('http://localhost/');
    });

    it('unsets the property with null', () => {
      const el = document.createElement('a');
      const prop = 'href';
      const old = 'https://foo.com/';
      const href = null;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, href);

      expect(el.href).toBe('http://localhost/');
    });
  });

  describe('attribute', () => {
    it('sets the attribute', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const old = null;
      const foo = 'test';

      diffProp(el, prop, old, foo);

      expect(el.getAttribute(prop)).toBe(foo);
    });

    it('does not reset attribute if old is same value', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const foo = 'test';
      const spy = jest.spyOn(el, 'setAttributeNS');

      diffProp(el, prop, null, foo);
      expect(spy).toHaveBeenCalledTimes(1);

      diffProp(el, prop, foo, foo);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('does not unset attribute if value is empty string', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const old = 'test';
      const foo = '';

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, foo);

      expect(el.hasAttribute(prop)).toBe(true);
    });

    it('unsets the attribute with false', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const old = 'test';
      const foo = false;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, foo);

      expect(el.hasAttribute(prop)).toBe(false);
    });

    it('unsets the attribute with undefined', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const old = 'test';
      const foo = undefined;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, foo);

      expect(el.hasAttribute(prop)).toBe(false);
    });

    it('unsets the attribute with null', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const old = 'test';
      const foo = null;

      diffProp(el, prop, null, old);
      diffProp(el, prop, old, foo);

      expect(el.hasAttribute(prop)).toBe(false);
    });

    it('does not set value if it is a function', () => {
      const el = document.createElement('div');
      const prop = 'foo';
      const foo = () => {};
      const spy = jest.spyOn(el, 'setAttributeNS');

      diffProp(el, prop, null, foo);

      expect(spy).not.toHaveBeenCalled();
      expect(el).not.toHaveProperty(prop);
    });
  });

  describe('xlink namespace', () => {
    describe('camelCase', () => {
      it('sets the attribute', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const old = null;
        const foo = 'test';

        diffProp(el, prop, old, foo);

        expect(el.getAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(foo);
      });

      it('does not reset attribute if old is same value', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const foo = 'test';

        diffProp(el, prop, null, foo);
        const spy = jest.spyOn(el, 'setAttributeNS');
        diffProp(el, prop, foo, foo);

        expect(spy).not.toHaveBeenCalled();
      });

      it('does not unset attribute if value is empty string', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const old = 'test';
        const foo = '';

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(true);
      });

      it('unsets the attribute with false', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const old = 'test';
        const foo = false;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('unsets the attribute with undefined', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const old = 'test';
        const foo = undefined;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('unsets the attribute with null', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const old = 'test';
        const foo = null;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('does not set value if it is a function', () => {
        const el = document.createElement('div');
        const prop = 'xlinkFoo';
        const foo = () => {};
        const spy = jest.spyOn(el, 'setAttributeNS');

        diffProp(el, prop, null, foo);

        expect(spy).not.toHaveBeenCalled();
        expect(el).not.toHaveProperty(prop);
      });
    });

    describe('xml prefixed', () => {
      it('sets the attribute', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const old = null;
        const foo = 'test';

        diffProp(el, prop, old, foo);

        expect(el.getAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(foo);
      });

      it('does not reset attribute if old is same value', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const foo = 'test';

        diffProp(el, prop, null, foo);
        const spy = jest.spyOn(el, 'setAttributeNS');
        diffProp(el, prop, foo, foo);

        expect(spy).not.toHaveBeenCalled();
      });

      it('does not unset attribute if value is empty string', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const old = 'test';
        const foo = '';

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(true);
      });

      it('unsets the attribute with false', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const old = 'test';
        const foo = false;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('unsets the attribute with undefined', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const old = 'test';
        const foo = undefined;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('unsets the attribute with null', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const old = 'test';
        const foo = null;

        diffProp(el, prop, null, old);
        diffProp(el, prop, old, foo);

        expect(el.hasAttributeNS('http://www.w3.org/1999/xlink', 'foo')).toBe(false);
      });

      it('does not set value if it is a function', () => {
        const el = document.createElement('div');
        const prop = 'xlink:foo';
        const foo = () => {};
        const spy = jest.spyOn(el, 'setAttributeNS');

        diffProp(el, prop, null, foo);

        expect(spy).not.toHaveBeenCalled();
        expect(el).not.toHaveProperty(prop);
      });
    });
  });
});

describe('addProps', () => {
  it('adds each property to element', () => {
    const el = document.createElement('div');
    const props = { foo: 'bar', class: 'class' };

    addProps(el, props);

    expect(el.getAttribute('foo')).toBe('bar');
    expect(el.getAttribute('class')).toBe('class');
  });
});

describe('addListeners', () => {
  it('adds each event listener to element', () => {
    const el = document.createElement('div');
    const onClick = jest.fn();
    const onFoo = jest.fn();
    const click = new Event('click');
    const foo = new Event('Foo');

    addListeners(el, { onClick, onFoo });
    el.dispatchEvent(click);
    el.dispatchEvent(foo);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(click);
    expect(onFoo).toHaveBeenCalledTimes(1);
    expect(onFoo).toHaveBeenCalledWith(foo);
  });

  it('skips regular attributes', () => {
    const el = document.createElement('div');
    const props = { foo: 'bar', class: 'class' };

    addListeners(el, props);

    expect(el.getAttribute('foo')).toBe(null);
    expect(el.getAttribute('class')).toBe(null);
  });
});

describe('diffProps', () => {
  it('updates properties', () => {
    const el = document.createElement('div');
    const old = { foo: 'bar', class: 'class' };
    const props = { foo: 'baz', class: 'clazz' };

    diffProps(el, {}, old);
    diffProps(el, old, props);

    expect(el.getAttribute('foo')).toBe('baz');
    expect(el.getAttribute('class')).toBe('clazz');
  });

  it('removes all old properties', () => {
    const el = document.createElement('div');
    const old = { foo: 'bar', class: 'class' };
    const props = { foo: 'bar' };

    diffProps(el, {}, old);
    diffProps(el, old, props);

    expect(el.getAttribute('foo')).toBe('bar');
    expect(el.getAttribute('class')).toBe('');
  });

  it('adds new properties', () => {
    const el = document.createElement('div');
    const old = { foo: 'bar' };
    const props = { foo: 'bar', class: 'class' };

    diffProps(el, {}, old);
    diffProps(el, old, props);

    expect(el.getAttribute('foo')).toBe('bar');
    expect(el.getAttribute('class')).toBe('class');
  });
});
