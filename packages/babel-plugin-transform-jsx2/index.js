const jsx = require('@babel/plugin-syntax-jsx');

module.exports = function({ types: t, template }, options = {}) {
  const {
    json = false,
    minimalJson = false,
    taggedTemplate = false,

    pragma = 'jsx2.createElement',
    pragmaFrag = 'jsx2.Fragment',
    pragmaTemplate = 'jsx2.templateResult',
  } = options;

  if (minimalJson && !json) {
    throw new Error('"minimalJson" option requires "json" to be true');
  }
  if (taggedTemplate && !json) {
    throw new Error('"taggedTemplate" option requires "json" to be true');
  }

  return {
    name: 'transform-jsx2',
    inherits: jsx.default,

    visitor: {
      'JSXElement|JSXFragment'(path) {
        path.replaceWith(buildTemplate(path));
      },
    },
  };

  function buildTemplate(path) {
    if (isComponent(path)) {
      return buildElement(path);
    }

    const program = path.findParent(p => p.isProgram());

    const expressions = [];
    let fragIndex;
    let tree = buildElement(path, {
      expressionMarker(node) {
        const { length } = expressions;
        expressions.push(node);
        return t.numericLiteral(taggedTemplate ? length + 1 : length);
      },

      fragMarker() {
        if (fragIndex === undefined) {
          fragIndex = this.expressionMarker(template.expression.ast(pragmaFrag));
        }
        return t.cloneNode(fragIndex);
      },
    });

    if (json) {
      const cooked = stringify(tree);
      if (taggedTemplate) {
        return buildTaggedTemplate(cooked, expressions);
      }

      const stringified = t.templateLiteral([buildTemplateElement(cooked)], []);
      tree = template.expression.ast`JSON.parse(${stringified})`;
    }

    const id = path.scope.generateUidIdentifier('template');
    const lazyTree = template.statement.ast`
      function ${id}(${json ? null : 'createElement'}) {
        const tree = ${tree};
        ${id} = () => tree;
        return tree;
      }
    `;
    program.pushContainer('body', lazyTree);

    return template.expression.ast`
      ${pragmaTemplate}(
        ${id}(${json ? null : pragma}),
        ${t.arrayExpression(expressions)}
      )
    `;
  }

  function buildElement(path, state) {
    if (state && isComponent(path)) {
      return state.expressionMarker(path.node);
    }

    const frag = path.isJSXFragment();
    const type = frag
      ? state
        ? state.fragMarker()
        : template.expression.ast(pragmaFrag)
      : elementType(path);

    const { props, key, ref, children } = buildProps(
      frag ? [] : path.get('openingElement.attributes'),
      path.get('children'),
      state
    );

    if (state && json) {
      return template.expression.ast`{
        type: ${type},
        key: ${key},
        ref: ${ref},
        props: ${props},
      }`;
    }

    return template.expression.ast`
      ${state ? 'createElement' : pragma}(
        ${type},
        ${props},
        ${children}
      )
    `;
  }

  function buildProps(attributePaths, childPaths, state) {
    const childrenStatic = [];
    const objs = [];
    let objProps = [];
    let key = minimalJson ? t.identifier('undefined') : t.stringLiteral('');
    let ref = minimalJson ? t.identifier('undefined') : t.nullLiteral();
    let props = state && minimalJson ? t.identifier('undefined') : t.nullLiteral();

    for (const attribute of attributePaths) {
      if (attribute.isJSXSpreadAttribute()) {
        objProps = pushProps(objProps, objs);
        const { argument } = attribute.node;
        if (state) {
          objs.push(state.expressionMarker(argument));
        } else {
          objs.push(t.objectExpression([t.spreadElement(argument)]));
        }
        continue;
      }

      const name = attribute.get('name');
      const value = attribute.get('value');

      if (state && json) {
        if (name.isJSXIdentifier({ name: 'key' })) {
          key = extractAttributeValue(value, state);
          continue;
        } else if (name.isJSXIdentifier({ name: 'ref' })) {
          ref = extractAttributeValue(value, state);
          continue;
        }
      }

      objProps.push(
        t.objectProperty(convertJSXName(name, false), extractAttributeValue(value, state))
      );
    }

    for (const child of childPaths) {
      if (child.isJSXText()) {
        const text = cleanJSXText(child.node);
        if (text) childrenStatic.push(text);
        continue;
      }

      if (child.isJSXSpreadChild()) {
        const array = t.arrayExpression([t.spreadElement(child.node.expression)]);
        if (state) {
          childrenStatic.push(state.expressionMarker(array));
        } else {
          childrenStatic.push(array);
        }
        continue;
      }

      if (child.isJSXExpressionContainer() && child.get('expression').isJSXEmptyExpression()) {
        continue;
      }

      childrenStatic.push(extractValue(child, state));
    }

    const children = childrenStatic.length ? t.arrayExpression(childrenStatic) : null;
    if (state && json && children) {
      objProps.push(t.objectProperty(t.identifier('children'), children));
    }
    pushProps(objProps, objs);

    if (objs.length) {
      if (objs.length === 1 && t.isObjectExpression(objs[0])) {
        props = objs[0];
      } else if (state) {
        props = t.arrayExpression(objs);
      } else {
        props = t.objectExpression(flatMap(objs, o => o.properties));
      }
    }

    return { props, key, ref, children };
  }

  function pushProps(objProps, objs) {
    if (!objProps.length) return objProps;

    objs.push(t.objectExpression(objProps));
    return [];
  }

  function extractAttributeValue(value, state) {
    if (!value.node) return t.booleanLiteral(true);
    return extractValue(value, state);
  }

  function extractValue(value, state) {
    if (value.isJSXExpressionContainer()) value = value.get('expression');

    if (value.isJSXElement() || value.isJSXFragment()) {
      if (state) return buildElement(value, state);
      return buildTemplate(value);
    }

    const { node } = value;
    if (isLiteral(value) && !value.isNumericLiteral()) return node;

    if (state) return state.expressionMarker(node);
    return node;
  }

  function elementType(path) {
    const node = convertJSXName(path.get('openingElement.name'));
    if (t.isStringLiteral(node)) return node;
    if (!t.isIdentifier(node)) return node;

    const { name } = node;
    if (t.react.isCompatTag(name)) return t.stringLiteral(name);
    return node;
  }

  function isComponent(path) {
    if (path.isJSXFragment()) return false;
    return !t.isStringLiteral(elementType(path));
  }

  function convertJSXName(name, root = true) {
    if (name.isJSXMemberExpression()) {
      return t.memberExpression(
        convertJSXName(name.get('object'), true),
        convertJSXName(name.get('property'), false)
      );
    }

    const { node } = name;
    if (name.isJSXNamespacedName()) {
      return t.stringLiteral(`${node.namespace.name}:${node.name.name}`);
    }

    if (root) {
      if (name.isJSXIdentifier({ name: 'this' })) {
        return t.thisExpression();
      }
      if (!t.isValidIdentifier(node.name)) {
        throw name.buildCodeFrameError('invalid name');
      }
    }

    return t.identifier(node.name);
  }

  function cleanJSXText(node) {
    return t.react.buildChildren({ children: [node] }).pop();
  }

  function flatMap(array, cb) {
    if (array.flatMap) {
      return array.flatMap(cb);
    }
    return array.reduce((collection, ...args) => {
      return collection.concat(cb(...args));
    }, []);
  }

  function stringify(node) {
    const { type } = node;
    switch (type) {
      case 'BooleanLiteral':
      case 'NullLiteral':
      case 'NumericLiteral':
      case 'StringLiteral':
      case 'TemplateLiteral':
        return JSON.stringify(literalValue(node));

      case 'Identifier':
        return JSON.stringify(node.name);

      case 'ArrayExpression':
        return `[${node.elements.map(stringify)}]`;

      case 'ObjectExpression':
        return `{${node.properties.map(stringify).filter(Boolean)}}`;

      case 'ObjectProperty': {
        const { key, value } = node;
        if (t.isIdentifier(value, { name: 'undefined' })) {
          return '';
        }
        return `${stringify(key)}:${stringify(value)}`;
      }
    }

    throw new Error(`Can't handle type "${type}"`);
  }

  function literalValue(node) {
    const { type } = node;
    switch (type) {
      case 'BooleanLiteral':
      case 'NumericLiteral':
      case 'StringLiteral':
        return node.value;

      case 'NullLiteral':
        return null;

      case 'TemplateElement':
        return node.value.cooked;

      case 'TemplateLiteral': {
        const { quasis, expressions } = node;
        let s = literalValue(quasis[0]);
        for (let i = 1; i < quasis.length; i++) {
          s += literalValue(expressions[i - 1]) + literalValue(quasis[i]);
        }
        return s;
      }
    }

    throw new Error(`Can't handle type "${type}"`);
  }

  function buildTaggedTemplate(json, expressions) {
    const regex = /((?:[^"\d]+(?:"(?:[^"\\]*|\\[^])+")?)+)(\d+|$)/g;
    const elements = [];
    const orderedExpressions = [];

    let match;
    while ((match = regex.exec(json))) {
      elements.push(buildTemplateElement(match[1]));

      const digit = +match[2];
      if (digit > 0) {
        orderedExpressions.push(t.cloneNode(expressions[digit - 1]));
      }
    }

    return t.taggedTemplateExpression(
      template.expression.ast(pragmaTemplate),
      t.templateLiteral(elements, orderedExpressions)
    );
  }

  function buildTemplateElement(cooked) {
    return t.templateElement({
      cooked,
      raw: cooked.replace(/\${|\\|`/g, '\\$&'),
    });
  }

  function isLiteral(path) {
    if (!path.isLiteral()) return false;
    if (path.isTemplateLiteral()) {
      return path.get('expressions').every(isLiteral);
    }
    if (path.isRegExpLiteral()) return false;
    if (json && path.isBigIntLiteral()) return false;
    return true;
  }
};
