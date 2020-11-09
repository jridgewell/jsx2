import { act, createElement, memo, render } from '../src/jsx2';

describe('memo', () => {
  function expectTextNode(node: null | Node, text: string) {
    expect(node).toBeTruthy();
    expect(node!.nodeType).toBe(Node.TEXT_NODE);
    expect(node!.textContent).toBe(text);
  }

  describe('using default props comparer', () => {
    describe('during initial render', () => {
      it('renders component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'test');
      });

      it('passes props to component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);
        const props = {};

        act(() => {
          render(createElement(Memo, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(props);
      });
    });

    describe('when rerendering with similar props', () => {
      it('skips rerendering', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });

        expect(C).not.toHaveBeenCalled();
        expectTextNode(body.firstChild, 'test');
      });

      it('ignores __source property', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, { __source: {} }), body);
        });
        C.mockClear();

        act(() => {
          render(createElement(Memo, { __source: {} }), body);
        });

        expect(C).not.toHaveBeenCalled();
        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('when rerendering with different props', () => {
      it('rerenders component if prop is missing old key', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        act(() => {
          render(createElement(Memo, {}), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'second');
      });

      it('rerenders component if prop contains new key', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, {}), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'second');
      });

      it('rerenders component if prop value changes', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        act(() => {
          render(createElement(Memo, { test: false }), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'second');
      });

      it('passes new props to component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const Memo = memo(C);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        const props = { test: false };
        act(() => {
          render(createElement(Memo, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(props);
      });
    });
  });

  describe('using custom props comparer', () => {
    describe('during initial render', () => {
      it('renders component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => true);
        const Memo = memo(C, areEqual);

        act(() => {
          render(createElement(Memo), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'test');
      });

      it('passes props to component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => true);
        const Memo = memo(C, areEqual);
        const props = {};

        act(() => {
          render(createElement(Memo, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(props);
      });

      it('does not call comparer', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => true);
        const Memo = memo(C, areEqual);
        const props = {};

        act(() => {
          render(createElement(Memo, props), body);
        });

        expect(areEqual).not.toHaveBeenCalled();
      });
    });

    describe('when comparer returns true', () => {
      it('skips rerendering', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => true);
        const Memo = memo(C, areEqual);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();

        act(() => {
          render(createElement(Memo, { test: false }), body);
        });

        expect(C).not.toHaveBeenCalled();
        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('when comparer returns false', () => {
      it('rerenders component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => false);
        const Memo = memo(C, areEqual);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        act(() => {
          render(createElement(Memo, { test: false }), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'second');
      });

      it('passes new props to component', () => {
        const body = document.createElement('body');
        const C = jest.fn(() => 'test');
        const areEqual = jest.fn(() => false);
        const Memo = memo(C, areEqual);

        act(() => {
          render(createElement(Memo, { test: true }), body);
        });
        C.mockClear();
        C.mockImplementation(() => 'second');

        const props = { test: false };
        act(() => {
          render(createElement(Memo, props), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C).toHaveBeenCalledWith(props);
      });
    });
  });
});
