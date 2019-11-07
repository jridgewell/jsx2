import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';
import replace from '@rollup/plugin-replace';


const pkg = require('./package.json');

export default {
  external: [],
  input: `src/jsx2.ts`,
  output: [
    { file: pkg.main, name: 'jsx2', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    // Change NODE_ENV to production to eliminate assert checks.
    replace({ 'process.env.NODE_ENV': "'production'" }),

    // Compile TypeScript files
    typescript(),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  watch: {
    include: 'src/**',
  },
};
