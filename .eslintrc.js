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
    'eslint-config-airbnb/rules/react',
    'eslint-config-airbnb/rules/react-a11y',
    'plugin:@typescript-eslint/recommended',
    '@colony/eslint-config-colony',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
    'jsdoc',
    'react-hooks',
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
  ],
  rules: {
    // Using the typescript-eslint version for that
    'no-unused-vars': 'off',
    // TypeScript overloads
    'no-dupe-class-members': 'off',
    'camelcase': ['error', {allow: ["^TEMP_"]}],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

    // @typescript-eslint
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    // jsx
    'jsx-a11y/label-has-for': 'off',

    // react
    'react/default-props-match-prop-types': 'off',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.test.js', '.tsx'] },
    ],
    'react/jsx-one-expression-per-line': 'off',
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

    'react/state-in-constructor': ['error', 'never'],
    'react/static-property-placement': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // import plugin (resolvers disabled in favour of using typescript)
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',

    // Disallow TODO but not @todo; these are expected to be handled by the jsdoc plugin
    'no-warning-comments': ['error', { terms: ['fixme', 'todo', 'xxx', '@fixme'], location: 'start' }],
    'jsdoc/check-indentation': 'off',
  },
};
