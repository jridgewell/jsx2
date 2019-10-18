module.exports = {
  transform: {
    '.ts': 'ts-jest',
  },
  testRegex: 'test/[^\\.]*\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  // TODO: Once we're more stable, reenable.
  // coverageThreshold: {
  //   global: {
  //     branches: 90,
  //     functions: 95,
  //     lines: 95,
  //     statements: 95,
  //   },
  // },
  collectCoverageFrom: ['src/*.{js,ts}'],
};
