module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    '@colony/eslint-config-colony',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-airbnb/rules/react',
    'eslint-config-airbnb/rules/react-a11y',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
    'import',
    'jsdoc',
    'react-hooks',
    'prettier',
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.test.js',
        '**/__tests__/*.test.ts',
        '**/__tests__/*.test.tsx',
      ],
      plugins: ['jest'],
      rules: {
        'max-len': 'off',
        'no-underscore-dangle': 'off',
        ...require('./.eslintrc.jest.js'),
      },
      env: {
        jest: true,
      },
    },
    {
      files: 'integration-testing/**/*.ts',
      plugins: ['ava'],
      rules: {
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
        'max-len': 'off',
      },
    },
  ],
  rules: {
    // @typescript-eslint
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // import
    'import/extensions': [
      'error',
      {
        js: 'off',
        tsx: 'off',
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

    // jsx
    'jsx-a11y/label-has-for': 'off',

    // react
    'react/default-props-match-prop-types': 'off',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.test.js', '.tsx'] },
    ],
    'react/jsx-props-no-spreading': 'off',
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
    'react/jsx-props-no-spreading': 'off',
    'react/static-property-placement': 'off',

    // miscellaneous
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.test.ts',
          '**/*.test.tsx',
          './src/__tests__/*.js',
          './src/__tests__/*.ts',
          './src/__tests__/*.tsx',
          './src/__mocks__/*.js',
          './*.js',
          './cypress/**/*.js',
        ],
      },
    ],
    'import/prefer-default-export': 'off',

    // Disallow TODO but not @todo; these are expected to be handled by the jsdoc plugin
    'no-warning-comments': ['error', { terms: ['fixme', 'todo', 'xxx', '@fixme'], location: 'start' }],
    'jsdoc/check-indentation': 'off',
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
