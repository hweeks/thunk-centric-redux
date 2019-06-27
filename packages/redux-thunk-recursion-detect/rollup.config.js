import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default [
  {
    input: 'src/reduxThunkRecursionDetect.ts',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      typescript(),
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
