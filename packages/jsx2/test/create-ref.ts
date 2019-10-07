import { createRef } from '../src/jsx2';

describe('createRef', () => {
  it('returns object with current property', () => {
    const ref = createRef();

    expect(ref).toHaveProperty('current');
  });

  it('initiailzes current property to null', () => {
    const ref = createRef();

    expect(ref).toHaveProperty('current', null);
  });
});
