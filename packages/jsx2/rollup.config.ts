import typescript from '@rollup/plugin-typescript';
import strip from '@rollup/plugin-strip';

function configure(esm) {
  return {
    input: 'src/jsx2.ts',
    output:  esm
        ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
        : { format: 'umd', name: 'dedent', dir: 'dist', entryFileNames: '[name].umd.js', sourcemap: true },
    plugins: [
      // Compile TypeScript files
      typescript(),

      // Eliminate debug blocks.
      strip({ include: '**/*.ts', functions: [], labels: ['debug'] }),
    ],
    watch: {
      include: 'src/**',
    },
  };
}

export default [configure(false), configure(true)];
