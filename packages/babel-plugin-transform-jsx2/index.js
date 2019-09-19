const jsx = require('@babel/plugin-syntax-jsx');

module.exports = function({ types: t, template }) {
  return {
    name: 'transform-jsx2',
    inherits: jsx.default,

    visitor: {
      'JSXElement|JSXFragment'(path) {
        path.replaceWith(buildTemplate(path));
      },
    },
  };

  function createElementRef(insideTemplate) {
    if (insideTemplate) return t.identifier('createElement');
    return template.expression.ast`jsx2.createElement`;
  }

  function expressionMarkerRef(insideTemplate) {
    if (insideTemplate) return t.identifier('expressionMarker');
    return template.expression.ast`jsx2.expressionMarker`;
  }

  function fragMarkerRef(insideTemplate) {
    if (insideTemplate) return t.identifier('Fragment');
    return template.expression.ast`jsx2.Fragment`;
  }

  function buildTemplate(path) {
    if (isComponent(path)) {
      return buildElement(path);
    }

    const expressions = [];
    const tree = buildElement(path, expressions);

    const id = path.scope.generateUidIdentifier('template');
    const lazyTree = template.statement.ast`
      function ${id}(
        ${createElementRef(true)},
        ${expressionMarkerRef(true)},
        ${fragMarkerRef(true)}
      ) {
        const tree = ${tree};
        ${id} = () => tree;
        return tree;
      }
    `;
    const program = path.findParent(p => p.isProgram());
    program.pushContainer('body', lazyTree);

    return template.expression.ast`
      jsx2.templateResult(
        ${id}(
          ${createElementRef(false)},
          ${expressionMarkerRef(false)},
          ${fragMarkerRef(false)}
        ),
        ${t.arrayExpression(expressions)}
      )
    `;
  }

  function buildElement(path, expressions) {
    if (isComponent(path) && expressions) {
      expressions.push(path.node);
      return expressionMarkerRef(true);
    }

    const frag = path.isJSXFragment();
    const type = frag ? fragMarkerRef(!!expressions) : elementType(path);

    const { props, children } = buildProps(
      frag ? [] : path.get('openingElement.attributes'),
      path.get('children'),
      expressions
    );

    return template.expression.ast`
      ${createElementRef(!!expressions)}(${type}, ${props}, ${children})
    `;
  }

  function buildProps(attributePaths, childPaths, expressions) {
    const childrenStatic = [];
    const objs = [];
    let objProps = [];

    for (let i = 0; i < attributePaths.length; i++) {
      const attribute = attributePaths[i];

      if (attribute.isJSXSpreadAttribute()) {
        objProps = pushProps(objProps, objs);
        const { argument } = attribute.node;
        if (expressions) {
          expressions.push(argument);
          objs.push(expressionMarkerRef(true));
        } else {
          objs.push(t.objectExpression([t.spreadElement(argument)]));
        }
        continue;
      }

      const name = attribute.get('name');
      const value = attribute.get('value');

      objProps.push(
        t.objectProperty(convertJSXName(name, false), extractAttributeValue(value, expressions))
      );
    }

    for (let i = 0; i < childPaths.length; i++) {
      const child = childPaths[i];
      if (child.isJSXText()) {
        const text = cleanJSXText(child.node);
        if (text) childrenStatic.push(text);
        continue;
      }

      if (child.isJSXSpreadChild()) {
        const array = t.arrayExpression([t.spreadElement(child.node.expression)]);
        if (expressions) {
          expressions.push(array);
          childrenStatic.push(expressionMarkerRef(true));
        } else {
          childrenStatic.push(array);
        }
        continue;
      }

      if (!expressions && (child.isJSXElement() || child.isJSXFragment())) {
        childrenStatic.push(buildTemplate(child));
        continue;
      }

      childrenStatic.push(extractValue(child, expressions));
    }
    pushProps(objProps, objs);

    const children = childrenStatic.length ? t.arrayExpression(childrenStatic) : null;
    const props = objs.length
      ? objs.length === 1 && t.isObjectExpression(objs[0])
        ? objs[0]
        : expressions
          ? t.arrayExpression(objs)
          : t.objectExpression(flatMap(objs, o => o.properties))
      : children
        ? t.nullLiteral()
        : null;

    return { props, children };
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

    const { node } = value;
    if (!expressions) return node;
    expressions.push(node);
    return expressionMarkerRef(true);
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
    return array.reduce((collection, ...args) => collection.concat(cb(...args)), []);
  }
};
