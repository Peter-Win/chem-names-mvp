module.exports = {
  roots: [
    "<rootDir>/src",
  ],
  moduleNameMapper: {
    "^charchem2/(.*)$": "<rootDir>/../charchem2.ts/src/$1",
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest', // Интегрируем SWC для .ts, .tsx, .js, .jsx
  },
};
