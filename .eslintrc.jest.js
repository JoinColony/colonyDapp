// Because of https://github.com/eslint/eslint/issues/8813

module.exports = {
  'jest/consistent-test-it': ['error', { fn: 'test' }],
  'jest/no-alias-methods': 'warn',
  'jest/no-disabled-tests': 'warn',
  'jest/no-focused-tests': 'error',
  'jest/no-identical-title': 'error',
  'jest/no-jest-import': 'error',
  'jest/no-jasmine-globals': 'warn',
  'jest/no-test-prefixes': 'error',
  'jest/valid-describe': 'error',
  'jest/valid-expect': 'error',
  'jest/valid-expect-in-promise': 'error'
};
