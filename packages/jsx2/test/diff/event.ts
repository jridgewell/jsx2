import { diffEvent } from '../../src/diff/event';

describe('diffEvent', () => {
  describe('event name ends in "Capture"', () => {
    it('registers event listener with capture=true', () => {
      const el = document.createElement('div');
      const listener = () => {};
      const spy = jest.spyOn(el, 'addEventListener');

      diffEvent(el, 'onfooCapture', null, listener);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), true);
    });

    it('event already registered, second with capture', () => {
      const el = document.createElement('div');
      const listener = () => {};
      const spy = jest.spyOn(el, 'addEventListener');

      diffEvent(el, 'onfoo', null, listener);
      diffEvent(el, 'onfooCapture', null, listener);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), false);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), true);
    });

    it('event already registered, first with capture', () => {
      const el = document.createElement('div');
      const listener = () => {};
      const spy = jest.spyOn(el, 'addEventListener');

      diffEvent(el, 'onfooCapture', null, listener);
      diffEvent(el, 'onfoo', null, listener);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), true);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), false);
    });

    it('unregisters listener', () => {
      const el = document.createElement('div');
      const old = () => {};
      const spy = jest.spyOn(el, 'removeEventListener');

      diffEvent(el, 'onfooCapture', null, old);
      diffEvent(el, 'onfooCapture', old, null);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('foo', expect.any(Function), true);
    });

    describe('lowercasing event names', () => {
      describe('standard event name', () => {
        it('lowercases name', () => {
          const el = document.createElement('div');
          const listener = () => {};
          const spy = jest.spyOn(el, 'addEventListener');

          diffEvent(el, 'onMouseMoveCapture', null, listener);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('mousemove', expect.any(Function), true);
        });

        it('unregisters name', () => {
          const el = document.createElement('div');
          const old = () => {};
          const spy = jest.spyOn(el, 'removeEventListener');

          diffEvent(el, 'onMouseMoveCapture', null, old);
          diffEvent(el, 'onMouseMoveCapture', old, null);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('mousemove', expect.any(Function), true);
        });
      });

      describe('nonstandard event name', () => {
        it('preserves name casing', () => {
          const el = document.createElement('div');
          const listener = () => {};
          const spy = jest.spyOn(el, 'addEventListener');

          diffEvent(el, 'onFooCapture', null, listener);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('Foo', expect.any(Function), true);
        });

        it('unregisters name', () => {
          const el = document.createElement('div');
          const old = () => {};
          const spy = jest.spyOn(el, 'removeEventListener');

          diffEvent(el, 'onFooCapture', null, old);
          diffEvent(el, 'onFooCapture', old, null);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('Foo', expect.any(Function), true);
        });
      });
    });
  });

  describe('lowercasing event names', () => {
    it('lowercases standard events', () => {
      const el = document.createElement('div');
      const listener = () => {};
      const spy = jest.spyOn(el, 'addEventListener');

      diffEvent(el, 'onMouseMove', null, listener);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('mousemove', expect.any(Function), false);
    });

    it('preserves nonstandard events casing', () => {
      const el = document.createElement('div');
      const listener = () => {};
      const spy = jest.spyOn(el, 'addEventListener');

      diffEvent(el, 'onFoo', null, listener);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Foo', expect.any(Function), false);
    });
  });

  describe('old listener is null', () => {
    describe('new listener is null', () => {
      it('does nothing', () => {
        const el = document.createElement('div');

        expect(() => {
          diffEvent(el, 'onFoo', null, null);
        }).not.toThrow();
      });
    });

    describe('new listener is function', () => {
      it('registers event listener', () => {
        const el = document.createElement('div');
        const listener = () => {};
        const spy = jest.spyOn(el, 'addEventListener');

        diffEvent(el, 'onClick', null, listener);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('click', expect.any(Function), false);
      });

      it('calls function when event fires', () => {
        const el = document.createElement('div');
        const listener = jest.fn();
        const event = new Event('click');

        diffEvent(el, 'onClick', null, listener);
        el.dispatchEvent(event);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(event);
      });
    });
  });

  describe('old listener is function', () => {
    describe('new listener is null', () => {
      it('unregisters listener', () => {
        const el = document.createElement('div');
        const old = () => {};
        const spy = jest.spyOn(el, 'removeEventListener');

        diffEvent(el, 'onClick', null, old);
        diffEvent(el, 'onClick', old, null);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('click', expect.any(Function), false);
      });

      it('does not call function when event fires', () => {
        const el = document.createElement('div');
        const old = jest.fn();
        const event = new Event('click');

        diffEvent(el, 'onClick', null, old);
        diffEvent(el, 'onClick', old, null);
        el.dispatchEvent(event);

        expect(old).not.toHaveBeenCalled();
      });
    });

    describe('new listener is different function', () => {
      it('does not register event listener again', () => {
        const el = document.createElement('div');
        const listener1 = () => {};
        const listener2 = () => {};
        const spy = jest.spyOn(el, 'addEventListener');

        diffEvent(el, 'onClick', null, listener1);
        diffEvent(el, 'onClick', listener1, listener2);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('click', expect.any(Function), false);
      });

      it('does not call old function when event fires', () => {
        const el = document.createElement('div');
        const old = jest.fn();
        const listener = () => {};
        const event = new Event('click');

        diffEvent(el, 'onClick', null, old);
        diffEvent(el, 'onClick', old, listener);
        el.dispatchEvent(event);

        expect(old).not.toHaveBeenCalled();
      });

      it('calls function when event fires', () => {
        const el = document.createElement('div');
        const old = () => {};
        const listener = jest.fn();
        const event = new Event('click');

        diffEvent(el, 'onClick', null, old);
        diffEvent(el, 'onClick', old, listener);
        el.dispatchEvent(event);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(event);
      });
    });

    describe('new listener is same function', () => {
      it('does not register event listener again', () => {
        const el = document.createElement('div');
        const listener = () => {};
        const spy = jest.spyOn(el, 'addEventListener');

        diffEvent(el, 'onClick', null, listener);
        diffEvent(el, 'onClick', listener, listener);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('click', expect.any(Function), false);
      });

      it('calls function when event fires', () => {
        const el = document.createElement('div');
        const listener = jest.fn();
        const event = new Event('click');

        diffEvent(el, 'onClick', null, listener);
        diffEvent(el, 'onClick', listener, listener);
        el.dispatchEvent(event);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(event);
      });
    });
  });
});
