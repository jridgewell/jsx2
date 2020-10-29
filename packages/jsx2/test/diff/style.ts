import { diffStyle } from '../../src/diff/style';

describe('diffStyle', () => {
  describe('new style is null', () => {
    describe('old style was null', () => {
      it('does nothing', () => {
        const el = document.createElement('div');
        const old = null;
        const value = null;

        expect(() => {
          diffStyle(el, old, value);
        }).not.toThrow();
      });
    });

    describe('old style was string', () => {
      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = 'background: black; opacity: 0';
        const value = null;

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('');
        expect(el.style.opacity).toBe('');
      });
    });

    describe('old style was object', () => {
      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black', opacity: 0 };
        const value = null;

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('');
        expect(el.style.opacity).toBe('');
      });
    });
  });

  describe('new style is string', () => {
    describe('old style was null', () => {
      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = null;
        const value = 'background: black; opacity: 0';

        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });

    describe('old style was string', () => {
      it('updates styles', () => {
        const el = document.createElement('div');
        const old = 'background: black; opacity: 0';
        const value = 'background: white; opacity: 0.5';

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('white');
        expect(el.style.opacity).toBe('0.5');
      });

      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = 'background: black; opacity: 0';
        const value = 'background: black';

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('');
      });

      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = 'background: black;';
        const value = 'background: black; opacity: 0';

        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });

    describe('old style was object', () => {
      it('updates styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black', opacity: 0 };
        const value = 'background: white; opacity: 0.5';

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('white');
        expect(el.style.opacity).toBe('0.5');
      });

      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black', opacity: 0 };
        const value = 'background: black';

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('');
      });

      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black' };
        const value = 'background: black; opacity: 0';

        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });
  });

  describe('new style is object', () => {
    describe('old style was null', () => {
      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = null;
        const value = { background: 'black', opacity: 0 };

        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });

    describe('old style was string', () => {
      it('updates styles', () => {
        const el = document.createElement('div');
        const old = 'background: black; opacity: 0';
        const value = { background: 'white', opacity: 0.5 };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('white');
        expect(el.style.opacity).toBe('0.5');
      });

      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = 'background: black; opacity: 0';
        const value = { background: 'black' };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('');
      });

      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = 'background: black;';
        const value = { background: 'black', opacity: 0 };

        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });

    describe('old style was object', () => {
      it('updates styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black', opacity: 0 };
        const value = { background: 'white', opacity: 0.5 };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('white');
        expect(el.style.opacity).toBe('0.5');
      });

      it('removes all old styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black', opacity: 0 };
        const value = { background: 'black' };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('');
      });

      it('sets new styles', () => {
        const el = document.createElement('div');
        const old = { background: 'black' };
        const value = { background: 'black', opacity: 0 };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.background).toBe('black');
        expect(el.style.opacity).toBe('0');
      });
    });

    describe('dimensional property', () => {
      it('sets the property', () => {
        const el = document.createElement('div');
        const old = null;
        const value = { width: 1, height: '1' };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.width).toBe('1px');
        expect(el.style.height).toBe('');
      });

      it('unsets the property', () => {
        const el = document.createElement('div');
        const old = { width: 1, height: '1' };
        const value = { height: '' };

        diffStyle(el, null, old);
        diffStyle(el, old, value);

        expect(el.style.width).toBe('');
        expect(el.style.height).toBe('');
      });
    });

    describe('custom property', () => {
      it('sets the property', () => {
        const el = document.createElement('div');
        const old = null;
        const value = { '--foo': 'black', '--bar': 0 };

        diffStyle(el, null, old);
        const spy = jest.spyOn(el.style, 'setProperty');
        diffStyle(el, old, value);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith('--foo', 'black');
        expect(spy).toHaveBeenCalledWith('--bar', 0);
      });

      it('unsets the property', () => {
        const el = document.createElement('div');
        const old = { '--foo': 'black', '--bar': 0 };
        const value = { '--foo': '' };

        diffStyle(el, null, old);
        const spy = jest.spyOn(el.style, 'setProperty');
        diffStyle(el, old, value);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith('--foo', '');
        expect(spy).toHaveBeenCalledWith('--bar', '');
      });
    });
  });
});
