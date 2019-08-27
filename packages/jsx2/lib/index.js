'use strict';

const jsx2 = exports;
Object.defineProperty(jsx2, '__esModule', {
  value: true,
});

const defaultProps = { children: null };

jsx2.createElement = function createElement(type, key, props) {
  return {
    type,
    key,
    props,
  };
};

jsx2.createTemplate = function createTemplate(template, expressions) {
  return {
    template,
    expressions,
    constructor: void 0,
  };
};

jsx2.Fragment = function Fragment(props) {
  return props.children;
};

const marker = { constructor: void 0 };
jsx2.expression = marker;

jsx2.isValidTemplate = template => {
  return template != null && template.constructor === undefined;
};

jsx2.render = function render(template, container) {
  const { template: t, expressions } = template;

  const current = container._jsx2_template;
  if (!current || current.template !== t) {
    container.innerHTML = '';
    container._jsx2_template = template;
    return initialRender(container, t, expressions, 0);
  }

  return diffExpressions(current, expressions);
};

function initialRender(container, node, expressions, expressionIndex) {
  let { type, props } = node;
  if (type === marker) type = expressions[expressionIndex++];

  const el = document.createElement(type);
  container.appendChild(el);

  if (!props) props = defaultProps;
  for (const prop in props) {
    if (prop !== 'children') {
      let value = props[value];
      if (value === marker) value = expressions[expressionIndex++];
      el.setAttribute(prop, value);
    }
  }

  const children = props.children;
  if (!children) return expressionIndex;

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const dynamic = child === marker;
    let comment;
    if (dynamic) {
      child = expressions[expressionIndex];
      comment = el.appendChild(document.createComment(''));
      expressions[expressionIndex++] = comment;
    }

    if (typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
      if (comment) {
        comment._jsx2_end = el.appendChild(document.createComment(''));
      }
      continue;
    }

    if (typeof child === 'string') {
      if (child) el.appendChild(document.createTextNode(child));
      if (comment) {
        comment._jsx2_end = el.appendChild(document.createComment(''));
      }
      continue;
    }

    if (!dynamic && typeof child === 'object') {
      expressionIndex = initialRender(el, child, expressions, expressionIndex);
      if (comment) {
        comment._jsx2_end = el.appendChild(document.createComment(''));
      }
      continue;
    }

    throw new Error('unsupported child');
  }

  return expressionIndex;
}

function diffExpressions(current, expressions) {
  const old = current.expressions;

  for (let i = 0; i < old.length; i++) {
    const comment = old[i];
    const { parentNode, _jsx2_end: end } = comment;
    let start = comment;

    const expression = expressions[i];
    const { nextSibling } = start;

    if (typeof expression === 'number') {
      if (nextSibling !== end && nextSibling.nodeType === 3) {
        start = nextSibling;
        nextSibling.data = expression;
      } else {
        start = parentNode.insertBefore(document.createTextNode(expression), nextSibling);
      }
      removeNodes(parentNode, start, end);
      continue;
    }

    if (typeof expression === 'string') {
      if (expression) {
        if (nextSibling !== end && nextSibling.nodeType === 3) {
          start = nextSibling;
          nextSibling.data = expression;
        } else {
          start = parentNode.insertBefore(document.createTextNode(expression), nextSibling);
        }
      }
      removeNodes(parentNode, start, end);
      continue;
    }

    throw new Error('unsupported child');
  }
}

function removeNodes(parentNode, start, end) {
  let n;
  while ((n = start.nextSibling) !== end) {
    parentNode.removeChild(n);
  }
}
