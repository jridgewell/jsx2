import { Component } from '../src/jsx2';

describe('Component', () => {
  it('is a constructor', () => {
    const c = new Component();

    expect(Object.getPrototypeOf(c)).toBe(Component.prototype);
  });

  it('has default render method', () => {
    expect(typeof Component.prototype.render).toEqual('function');
  });

  it('renders nothing by default', () => {
    const c = new Component();

    expect(c.render({ a: 1, children: 'foo' })).toBe(undefined);
  });
});
