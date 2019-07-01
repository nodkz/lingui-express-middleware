module.exports = {
  compileNamespace: 'cjs',
  extractBabelOptions: {},
  fallbackLocale: 'en',
  sourceLocale: '',
  locales: ['en', 'ru', 'kk'],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['pages'],
      exclude: ['*/node_modules/*'],
    },
  ],
  format: 'minimal', // 'po', 'minimal', 'lingui', 'fluent'
};
