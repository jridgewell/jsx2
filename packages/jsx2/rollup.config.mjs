import strip from '@rollup/plugin-strip';
import typescript from '@rollup/plugin-typescript';

const entryPoints = {
  jsx2: 'src/jsx2.ts',
  jsx2Runtime: 'src/jsx-runtime.ts',
};

function configure(name, input, esm) {
  return {
    input,
    output: esm
      ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
      : {
          format: 'umd',
          name,
          dir: 'dist',
          entryFileNames: '[name].umd.js',
          sourcemap: true,
          globals: { jsx2: 'jsx2' },
        },

    external: ['jsx2'],

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

export default Object.entries(entryPoints).flatMap(([name, input]) => {
  return [configure(name, input, true), configure(name, input, false)];
});
