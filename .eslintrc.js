module.exports = {
  root: true,
  extends: '@arcblock/eslint-config',
  globals: {
    logger: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  // shadcn/ui
  ignorePatterns: ['src/components/ui/**', 'src/lib/**'],
};
