import { act, createElement, createRef, forwardRef, render } from '../src/jsx2';

describe('forwardRef', () => {
  function expectTextNode(node: null | Node, text: string) {
    expect(node).toBeTruthy();
    expect(node!.nodeType).toBe(Node.TEXT_NODE);
    expect(node!.textContent).toBe(text);
  }

  describe('during initial render', () => {
    describe('with no ref given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const simpleProps = { p: true };
        const props = { ...simpleProps };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, null);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const simpleProps = { p: true };
        const props = { ...simpleProps };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('with ref object given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const ref = createRef();
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, ref);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const ref = createRef();
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('with ref function given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const ref = () => {};
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, ref);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const ref = () => {};
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });
  });

  describe('during rerender', () => {
    describe('with no ref given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const simpleProps = { p: true };
        const props = { ...simpleProps };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, null);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const simpleProps = { p: true };
        const props = { ...simpleProps };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('with ref object given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const ref = createRef();
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, ref);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const ref = createRef();
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('with ref function given to component', () => {
      it('calls component with null ref', () => {
        const body = document.createElement('body');
        const C = jest.fn();
        const Forwarded = forwardRef(C);
        const ref = () => {};
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(simpleProps, ref);
      });

      it("returns component's renderble", () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Forwarded = forwardRef(C);
        const ref = () => {};
        const simpleProps = { p: true };
        const props = { ...simpleProps, ref };

        act(() => {
          render(createElement(Forwarded, props), body);
          C.mockClear();
          render(createElement(Forwarded, props), body);
        });

        expectTextNode(body.firstChild, 'test');
      });
    });
  });
});
