const jsx = require('@babel/plugin-syntax-jsx');

module.exports = function({ types: t, template }) {
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

  function buildElement(path, quasis) {
    const root = quasis === undefined;
    if (!quasis) quasis = [];

    const frag = path.isJSXFragment();
    const opening = path.get('openingElement');
    const type = frag
      ? template.expression.ast`jsx2.Fragment`
      : elementType(convertJSXName(opening.get('name')), quasis);
    const { props, key, ref } = buildProps(
      frag ? [] : opening.get('attributes'),
      path.get('children'),
      quasis
    );

    const obj = template.expression.ast`({
      type: ${type},
      key: ${key},
      ref: ${ref},
      props: ${props},
      constructor: void 0,
    })`;
    if (!root) return obj;

    return template.expression.ast`({
      template: ${obj},
      quasis: ${t.arrayExpression(quasis)},
      constructor: void 0,
    })`;
  }

  function buildProps(attributePaths, childPaths, quasis) {
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
        quasis.push(attribute.node.argument);
        objs.push(template.expression.ast`jsx2.expression`);
        continue;
      }

      const name = attribute.get('name');
      const value = attribute.get('value');

      if (name.isJSXIdentifier({ name: 'key' })) {
        key = extractAttributeValue(value, quasis);
        continue;
      } else if (name.isJSXIdentifier({ name: 'ref' })) {
        ref = extractAttributeValue(value, quasis);
        continue;
      } else if (name.isJSXIdentifier({ name: 'children' })) {
        childrenProp = extractAttributeValue(value, quasis);
        continue;
      }

      objProps.push(t.objectProperty(convertJSXName(name), extractAttributeValue(value, quasis)));
    }

    for (let i = 0; i < childPaths.length; i++) {
      const child = childPaths[i];
      if (child.isJSXText()) {
        const text = cleanJSXText(child.node);
        if (text) children.push(text);
        continue;
      }

      if (child.isJSXSpreadChild()) {
        quasis.push(t.arrayExpression([t.spreadElement(child.node.expression)]));
        children.push(template.expression.ast`jsx2.expression`);
        continue;
      }

      children.push(extractValue(child, quasis));
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

  function extractAttributeValue(value, quasis) {
    if (!value.node) return t.booleanLiteral(true);
    return extractValue(value, quasis);
  }

  function extractValue(value, quasis) {
    if (value.isJSXExpressionContainer()) value = value.get('expression');

    if (value.isJSXElement() || value.isJSXFragment()) {
      return buildElement(value, quasis);
    }
    if (isLiteral(value)) return value.node;

    quasis.push(value.node);
    return template.expression.ast`jsx2.expression`;
  }

  function isLiteral(path) {
    if (path.isLiteral()) return true;

    if (path.isArrayExpression()) {
      return path.get('elements').every(isLiteral);
    }

    if (path.isObjectExpression()) {
      return path.get('properties').every(prop => {
        if (prop.node.computed) {
          if (!isLiteral(prop.get('key'))) return false;
        }

        return isLiteral(prop.get('value'));
      });
    }

    return false;
  }

  function elementType(node, quasis) {
    if (t.isStringLiteral(node)) return node;

    if (t.isIdentifier(node)) {
      const { name } = node;
      if (t.react.isCompatTag(name)) return t.stringLiteral(name);
    }

    quasis.push(node);
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

  function cleanJSXText(node) {
    return t.react.buildChildren({ children: [node] }).pop();
  }
};
