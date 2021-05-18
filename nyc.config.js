module.exports = {
  'lines': 100,
  'statements': 100,
  'functions': 100,
  'branches': 100,
  'include': [
    'src/**/*.js',
  ],
  'exclude': [
    'test/**/*.test.js',
  ],
  'require': [
    '@babel/register',
    './test/helper.js',
  ],
  'reporter': [
    'text',
    'json-summary',
    'lcov',
    'html',
    'text-summary',
  ],
  'sourceMap': false,
  'instrument': false,
  'cache': false,
  'check-coverage': true,
  'all': true,
};
