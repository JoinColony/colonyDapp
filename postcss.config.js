const path = require('path');
const postCSSImport = require('postcss-import');
const postCSSPresetEnv = require('postcss-preset-env');

// Aliases for CSS @import rules (relative to this file)
const aliases = {
  'variables.css': './src/styles/variables.css',
};

module.exports = {
  plugins: [
    postCSSImport({
      resolve(id) {
        if (typeof aliases[id] == 'string') {
          return path.resolve(__dirname, aliases[id]);
        }
        return id;
      },
    }),
    postCSSPresetEnv({
      features: {
        'nesting-rules': true,
        'color-mod-function': { unresolved: 'warn' },
      },
      importFrom: './src/styles/variables.css',
    }),
  ],
};
