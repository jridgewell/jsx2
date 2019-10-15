import { render } from '../src/jsx2';
import { JSDOM } from 'jsdom';

describe('render', () => {
  function context(html = '') {
    return new JSDOM(html).window;
  }

  it('renders nothing for null', () => {
    const { body } = context().document;
    render(null, body);

    expect(body.firstChild).toBe(null);
  });
});
