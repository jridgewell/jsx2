const { default: pathSorter } = require('@jridgewell/path-sorter');

module.exports = {
  create(context) {
    const imports = [];
    const source = context.getSourceCode();

    function process() {
      if (imports.length === 0) return;

      const nodes = imports.slice();
      const sorted = nodes.slice().sort((a, b) => {
        return pathSorter(a.source.value, b.source.value);
      });
      imports.length = 0;

      const isSorted = sorted.every((v, i) => nodes[i] === v);

      if (isSorted) return;

      context.report({
        node: sorted[0],
        message: [
          'imports must be sorted by source path',
          'expected:',
          ...sorted.map((n) => n.source.value),
        ].join('\n\t'),
        fix(fixer) {
          const s = sorted.map((n) => source.getText(n)).join('\n');
          return fixer.replaceTextRange([nodes[0].range[0], nodes[nodes.length - 1].range[1]], s);
        },
      });
    }

    function sortImports(node) {
      const specifiers = node.specifiers.filter((s) => s.type === 'ImportSpecifier');
      const sorted = specifiers.slice().sort((a, b) => {
        const aImported = a.imported.name;
        const bImported = b.imported.name;
        if (aImported < bImported) return -1;
        if (bImported < aImported) return 1;
        return 0;
      });

      const isSorted = sorted.every((v, i) => specifiers[i] === v);
      if (isSorted) return true;

      context.report({
        node: sorted[0],
        message: [
          'import specifiers must be sorted alphabetically',
          'expected',
          ...sorted.map(n => n.imported.name),
        ].join('\n\t'),
        fix(fixer) {
          return fixer.replaceTextRange(
            [specifiers[0].range[0], specifiers[specifiers.length - 1].range[1]],
            sorted.map((n) => source.getText(n)).join(', '),
          );
        },
      });

      return false;
    }

    return {
      'Program:exit'() {
        process();
      },

      ImportDeclaration(node) {
        if (!sortImports(node)) {
          return;
        }

        if (imports.length === 0) {
          return imports.push(node);
        }

        const last = imports[imports.length - 1];
        if (node.loc.start.line > last.loc.end.line + 1) {
          process();
        }

        imports.push(node);
      },
    };
  },
};
