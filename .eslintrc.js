module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    '@colony/eslint-config-colony',
    'plugin:flowtype/recommended',
    'eslint-config-airbnb/rules/react',
    'eslint-config-airbnb/rules/react-a11y',
  ],
  plugins: [
    'jsdoc',
    'react-hooks',
  ],
  overrides: [
    {
      files: '**/__tests__/*.js',
      plugins: ['jest'],
      rules: {
        'flowtype/require-valid-file-annotation': 'off',
        'max-len': 'off',
        'no-underscore-dangle': 'off',
        ...require('./.eslintrc.jest.js'),
      },
      env: {
        jest: true,
      },
    },
    {
      files: 'integration-testing/**/*.js',
      plugins: ['ava'],
      rules: {
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        'flowtype/require-valid-file-annotation': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
        'max-len': 'off',
      },
    },
  ],
  rules: {
    'max-len': [
      'error',
      {
        ignorePattern: '^import [^,]+ from |^export | implements',
        ignoreComments: true,
      },
    ],
    'jsx-a11y/label-has-for': 'off',
    'flowtype/generic-spacing': 'off',
    'flowtype/space-after-type-colon': 'off',
    'flowtype/require-valid-file-annotation': [
      'error',
      'always',
      {
        annotationStyle: 'block',
      },
    ],
    'import/extensions': [
      'error',
      {
        js: 'never',
        jsx: 'always',
        json: 'always',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          './src/__tests__/*.js',
          './src/__mocks__/*.js',
          './*.js',
          './cypress/**/*.js',
        ],
      },
    ],
    'react/default-props-match-prop-types': 'off',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.test.js', '.jsx'] },
    ],
    'react/jsx-wrap-multilines': 'off',
    'react/require-default-props': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'type-annotations',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render',
        ],
      },
    ],
    'react/jsx-one-expression-per-line': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Disallow TODO but not @todo; these are expected to be handled by the jsdoc plugin
    'no-warning-comments': ['error', { terms: ['fixme', 'todo', 'xxx', '@fixme'], location: 'start' }],
    'jsdoc/check-indentation': 1,
  },
  settings: {
    'import/resolver': {
      jest: {
        jestConfigFile: './jest.conf.json',
      },
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
};
