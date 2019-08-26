module.exports = function({ types: t, template }) {
  const visitor = {
    'JSXElement|JSXFragment'(path) {
      const obj = buildElement(path);
      if (obj) {
        path.replaceWith(obj);
        path.get('properties.0.value').hoist();
      }
    },
  };

  return { visitor };

  function buildElement(path, expressions) {
    const root = expressions === undefined;
    if (!expressions) expressions = [];

    const frag = path.isJSXFragment();
    const opening = path.get('openingElement');
    const type = frag
      ? template.expression.ast`jsx2.Fragment`
      : elementType(convertJSXName(opening.get('name')), expressions);
    const { props, key, ref } = buildProps(
      frag ? [] : opening.get('attributes'),
      path.get('children'),
      expressions
    );

    const objProps = [
      t.objectProperty(t.identifier('type'), type),
      t.objectProperty(t.identifier('key'), key),
      t.objectProperty(t.identifier('ref'), ref),
      t.objectProperty(t.identifier('props'), props),
      t.objectProperty(t.identifier('constructor'), path.scope.buildUndefinedNode()),
    ];

    const obj = t.objectExpression(objProps);
    if (!root) return obj;

    return t.objectExpression([
      t.objectProperty(t.identifier('template'), obj),
      t.objectProperty(t.identifier('expressions'), t.arrayExpression(expressions)),
    ]);
  }

  function buildProps(attributePaths, childPaths, expressions) {
    const children = [];
    let key = t.nullLiteral();
    let ref = t.nullLiteral();
    let childrenProp;

    let objProps = [];
    for (let i = 0; i < attributePaths.length; i++) {
      const attribute = attributePaths[i];

      if (attribute.isJSXSpreadAttribute()) {
        throw attribute.buildCodeFrameError('unsupported');
      }

      const name = attribute.get('name');
      const value = attribute.get('value');

      if (name.isIdentifier({ name: 'key' })) {
        key = extractAttributeValue(value, expressions);
        continue;
      } else if (name.isIdentifier({ name: 'ref' })) {
        ref = extractAttributeValue(value, expressions);
        continue;
      } else if (name.isIdentifier({ name: 'children' })) {
        childrenProp = extractAttributeValue(value, expressions);
        continue;
      }

      objProps.push(
        t.objectProperty(convertJSXName(name), extractAttributeValue(value, expressions))
      );
    }

    for (let i = 0; i < childPaths.length; i++) {
      const child = childPaths[i];
      if (child.isJSXText()) {
        children.push(t.stringLiteral(child.node.value));
        continue;
      }

      if (child.isJSXSpreadChild()) throw child.buildCodeFrameError('unsupported');

      children.push(extractValue(child, expressions));
    }

    if (children.length || childrenProp) {
      const c = t.arrayExpression(children.length ? children : childrenProp);
      objProps.push(t.objectProperty(t.identifier('children'), c));
    }

    const props = objProps.length ? t.objectExpression(objProps) : t.nullLiteral();

    return { key, ref, props };
  }

  function extractAttributeValue(value, expressions) {
    if (!value.node) return t.booleanLiteral(true);
    return extractValue(value, expressions);
  }

  function extractValue(value, expressions) {
    if (value.isJSXElement() || value.isJSXFragment()) {
      return buildElement(value, expressions);
    }
    if (!value.isJSXExpressionContainer()) return value.node;

    const expression = value.get('expression');

    if (expression.isJSXElement() || expression.isJSXFragment()) {
      return buildElement(expression, expressions);
    }
    if (expression.isLiteral()) return expression.node;

    expressions.push(expression.node);
    return template.expression.ast`jsx2.expression`;
  }

  function elementType(node, expressions) {
    if (t.isStringLiteral(node)) return node;

    if (t.isIdentifier(node)) {
      const { name } = node;
      if (t.react.isCompatTag(name)) return t.stringLiteral(name);
    }

    expressions.push(node);
    return template.expression.ast`jsx2.expression`;
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
};
