import strip from '@rollup/plugin-strip';
import typescript from '@rollup/plugin-typescript';

function configure(esm) {
  return {
    input: 'src/jsx2.ts',
    output:  esm
        ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
        : { format: 'umd', name: 'jsx2', dir: 'dist', entryFileNames: '[name].umd.js', sourcemap: true },
    plugins: [
      // Compile TypeScript files
      typescript({ tsconfig: './tsconfig.build.json' }),

      // Eliminate debug blocks.
      strip({ include: '**/*.ts', functions: [], labels: ['debug'] }),
    ],
    watch: {
      include: 'src/**',
    },
  };
}

export default [configure(false), configure(true)];
