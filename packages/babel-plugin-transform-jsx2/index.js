const jsx = require('@babel/plugin-syntax-jsx');

module.exports = function({ types: t, template }) {
  const fragMarker = template.expression`jsx2.Fragment`;
  const expressionMarker = template.expression`jsx2.expression`;

  return {
    name: 'transform-jsx2',
    inherits: jsx.default,

    visitor: {
      'JSXElement|JSXFragment'(path) {
        path.replaceWith(buildElement(path));
        path.get('properties.0.value').hoist();
      },
    },
  };

  function buildElement(path, expressions) {
    const root = expressions === undefined;
    if (!expressions) expressions = [];

    const frag = path.isJSXFragment();
    const opening = path.get('openingElement');
    const type = frag
      ? fragMarker()
      : elementType(convertJSXName(opening.get('name')), expressions);
    const { props, key, ref } = buildProps(
      frag ? [] : opening.get('attributes'),
      path.get('children'),
      expressions
    );

    const tree = template.expression.ast`({
      type: ${type},
      key: ${key},
      ref: ${ref},
      props: ${props},
    })`;
    if (!root) return tree;

    return template.expression.ast`({
      tree: ${tree},
      expressions: ${t.arrayExpression(expressions)},
      constructor: void 0,
    })`;
  }

  function buildProps(attributePaths, childPaths, expressions) {
    const children = [];
    let key = t.nullLiteral();
    let ref = t.nullLiteral();
    let childrenProp;

    let objs = [];
    let objProps = [];
    for (let i = 0; i < attributePaths.length; i++) {
      const attribute = attributePaths[i];

      if (attribute.isJSXSpreadAttribute()) {
        objProps = pushProps(objProps, objs);
        expressions.push(attribute.node.argument);
        objs.push(expressionMarker());
        continue;
      }

      const name = attribute.get('name');
      const value = attribute.get('value');

      if (name.isJSXIdentifier({ name: 'key' })) {
        key = extractAttributeValue(value, expressions);
        continue;
      } else if (name.isJSXIdentifier({ name: 'ref' })) {
        ref = extractAttributeValue(value, expressions);
        continue;
      } else if (name.isJSXIdentifier({ name: 'children' })) {
        childrenProp = extractAttributeValue(value, expressions);
        continue;
      }

      objProps.push(
        t.objectProperty(convertJSXName(name, false), extractAttributeValue(value, expressions))
      );
    }

    for (let i = 0; i < childPaths.length; i++) {
      const child = childPaths[i];
      if (child.isJSXText()) {
        const text = cleanJSXText(child.node);
        if (text) children.push(text);
        continue;
      }

      if (child.isJSXSpreadChild()) {
        expressions.push(t.arrayExpression([t.spreadElement(child.node.expression)]));
        children.push(expressionMarker());
        continue;
      }

      children.push(extractValue(child, expressions));
    }

    if (children.length || childrenProp) {
      const c = t.arrayExpression(children.length ? children : [childrenProp]);
      objProps.push(t.objectProperty(t.identifier('children'), c));
    }
    pushProps(objProps, objs);

    const props = objs.length
      ? objs.length === 1 && t.isObjectExpression(objs[0])
        ? objs[0]
        : t.arrayExpression(objs)
      : t.nullLiteral();

    return { key, ref, props };
  }

  function pushProps(objProps, objs) {
    if (!objProps.length) return objProps;

    objs.push(t.objectExpression(objProps));
    return [];
  }

  function extractAttributeValue(value, expressions) {
    if (!value.node) return t.booleanLiteral(true);
    return extractValue(value, expressions);
  }

  function extractValue(value, expressions) {
    if (value.isJSXExpressionContainer()) value = value.get('expression');

    if (value.isJSXElement() || value.isJSXFragment()) {
      return buildElement(value, expressions);
    }
    if (value.isLiteral()) return value.node;

    expressions.push(value.node);
    return expressionMarker();
  }

  function elementType(node, expressions) {
    if (t.isStringLiteral(node)) return node;

    if (t.isIdentifier(node)) {
      const { name } = node;
      if (t.react.isCompatTag(name)) return t.stringLiteral(name);
    }

    expressions.push(node);
    return expressionMarker();
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
};
