const jsx = require('@babel/plugin-syntax-jsx');
const { addNamed } = require('@babel/helper-module-imports');

module.exports = function ({ types: t, template }, options) {
  // istanbul ignore next
  const {
    staticBlocks = true,
    json = true,
    minimalJson = false,
    taggedTemplate = true,
    prettyJson = false,

    importSource = 'jsx2',
  } = options || {};
  const importMap = new WeakMap();

  if (json && !staticBlocks) {
    throw new Error('"json" option requires "staticBlocks" to be true');
  }
  if (minimalJson && !json) {
    throw new Error('"minimalJson" option requires "json" to be true');
  }
  if (taggedTemplate && !json) {
    throw new Error('"taggedTemplate" option requires "json" to be true');
  }
  if (prettyJson && !json) {
    throw new Error('"prettyJson" option requires "json" to be true');
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

  function getImport(path, name) {
    const program = path.findParent((p) => p.isProgram());
    let map = importMap.get(program);
    if (map === undefined) {
      map = { __proto__: null };
      importMap.set(program, map);
    }
    const imported = map[name];
    if (imported) return t.cloneNode(imported);
    return (map[name] = addNamed(program, name, importSource));
  }

  function buildTemplate(path) {
    if (!staticBlocks || isComponent(path)) {
      return buildElement(path);
    }

    const program = path.findParent((p) => p.isProgram());

    const expressions = [];
    let fragIndex;
    let tree = buildElement(path, {
      expressionMarker(node) {
        const { length } = expressions;
        expressions.push(node);
        return t.numericLiteral(length);
      },

      fragMarker() {
        if (!json) {
          return getImport(path, 'Fragment');
        }
        if (fragIndex === undefined) {
          fragIndex = this.expressionMarker(getImport(path, 'Fragment'));
        }
        return t.cloneNode(fragIndex);
      },
    });

    if (json) {
      const cooked = stringify(tree);
      if (taggedTemplate) {
        return buildTaggedTemplate(path, cooked, expressions);
      }

      const stringified = t.templateLiteral([buildTemplateElement(cooked)], []);
      tree = template.expression.ast`JSON.parse(${stringified})`;
    }

    const id = path.scope.generateUidIdentifier('template');
    const lazyTree = template.statement.ast`
      function ${id}() {
        const tree = ${tree};
        ${t.cloneNode(id)} = () => tree;
        return tree;
      }
    `;
    program.pushContainer('body', lazyTree);

    return template.expression.ast`
      ${getImport(path, 'templateBlock')}(
        ${t.cloneNode(id)}(),
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
        : getImport(path, 'Fragment')
      : elementType(path);

    const { props, key, ref, children } = buildProps(
      frag ? [] : path.get('openingElement.attributes'),
      path.get('children'),
      state,
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
      ${getImport(path, 'createElement')}(
        ${type},
        ${props},
        ${children}
      )
    `;
  }

  function buildProps(attributePaths, childPaths, state) {
    const staticChildren = [];
    const objs = [];
    let objProps = [];
    let key = minimalJson ? voidExpression() : t.stringLiteral('');
    let ref = minimalJson ? voidExpression() : t.nullLiteral();
    let props = state && minimalJson ? voidExpression() : t.nullLiteral();
    let children = null;

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
        t.objectProperty(convertJSXName(name, false), extractAttributeValue(value, state)),
      );
    }

    for (const child of childPaths) {
      if (child.isJSXText()) {
        const text = cleanJSXText(child.node);
        if (text) staticChildren.push(text);
        continue;
      }

      if (child.isJSXSpreadChild()) {
        const array = t.arrayExpression([t.spreadElement(child.node.expression)]);
        if (state) {
          staticChildren.push(state.expressionMarker(array));
        } else {
          staticChildren.push(array);
        }
        continue;
      }

      if (child.isJSXExpressionContainer() && child.get('expression').isJSXEmptyExpression()) {
        continue;
      }

      staticChildren.push(extractValue(child, state));
    }

    if (staticChildren.length) {
      if (staticChildren.length === 1) {
        children = staticChildren[0];
      } else if (state && json) {
        children = t.arrayExpression(staticChildren);
      } else {
        children = staticChildren;
      }
    }
    if (state && json && children) {
      objProps.push(t.objectProperty(t.identifier('children'), children));
    }

    pushProps(objProps, objs);
    if (objs.length) {
      if (objs.length === 1) {
        props = objs[0];
      } else if (state) {
        props = t.arrayExpression(objs);
      } else {
        props = t.objectExpression(flatMap(objs, (o) => o.properties));
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
    return extractValue(value, state, true);
  }

  function extractValue(value, state, disallowElements = false) {
    if (value.isJSXExpressionContainer()) value = value.get('expression');

    if (value.isJSXElement() || value.isJSXFragment()) {
      if (state && disallowElements) return state.expressionMarker(value.node);
      if (state) return buildElement(value, state);
      return buildTemplate(value);
    }

    const { node } = value;
    if (isLiteral(node, !json) && !value.isNumericLiteral()) return node;

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
        convertJSXName(name.get('property'), false),
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

  // istanbul ignore next
  function flatMap(array, cb) {
    if (array.flatMap) {
      return array.flatMap(cb);
    }
    return array.reduce((collection, ...args) => {
      return collection.concat(cb(...args));
    }, []);
  }

  function voidExpression() {
    return template.expression.ast`void 0`;
  }

  function stringify(node) {
    return JSON.stringify(literalValue(node), null, prettyJson ? 2 : 0);
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

      case 'Identifier':
        return node.name;

      case 'UnaryExpression':
        return undefined;

      case 'ArrayExpression':
        return node.elements.map(literalValue);

      case 'ObjectExpression': {
        const o = { __proto__: null };
        const { properties } = node;
        for (let i = 0; i < properties.length; i++) {
          const { key, value } = properties[i];
          o[literalValue(key)] = literalValue(value);
        }
        return o;
      }
    }

    // istanbul ignore next
    throw new Error(`Can't handle type "${type}"`);
  }

  function buildTaggedTemplate(path, json, expressions) {
    const regex = /((?:[^"\d]+(?:"(?:[^"\\]*|\\[^])+")?)+)(\d+|$)/g;
    const elements = [];
    const orderedExpressions = [];
    const remapped = { __proto__: null };
    const { scope } = path;

    let expected = 0;
    let match;
    while ((match = regex.exec(json))) {
      elements.push(buildTemplateElement(match[1]));

      // Is this the end of the json?
      if (match[2] === '') continue;

      const digit = +match[2];
      if (digit === expected) {
        orderedExpressions.push(expressions[digit]);
        expected++;
        continue;
      } else if (digit < expected) {
        orderedExpressions.push(t.cloneNode(remapped[digit] || expressions[digit]));
        continue;
      }

      const sequence = [];
      while (expected < digit) {
        const expression = expressions[expected];
        if (isLiteral(expression, true)) {
          expected++;
          continue;
        }
        const id = scope.generateUidIdentifierBasedOnNode(expression);
        remapped[expected] = id;

        scope.push({ id });
        sequence.push(template.expression.ast`${t.cloneNode(id)} = ${expression}`);
        expected++;
      }
      if (sequence.length === 0) {
        orderedExpressions.push(expressions[digit]);
      } else {
        sequence.push(expressions[digit]);
        orderedExpressions.push(t.sequenceExpression(sequence));
      }
      expected++;
    }

    return t.taggedTemplateExpression(
      getImport(path, 'templateBlock'),
      t.templateLiteral(elements, orderedExpressions),
    );
  }

  function buildTemplateElement(cooked) {
    return t.templateElement({
      cooked,
      raw: cooked.replace(/\${|\\|`/g, '\\$&'),
    });
  }

  function isLiteral(node, allowBigInt) {
    if (!t.isLiteral(node)) return false;
    if (t.isRegExpLiteral(node)) return false;
    if (t.isTemplateLiteral(node)) {
      return node.expressions.every((e) => isLiteral(e, allowBigInt));
    }
    if (!allowBigInt && t.isBigIntLiteral(node)) return false;
    return true;
  }
};
