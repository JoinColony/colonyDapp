const path = require('path');
const postCSSImport = require('postcss-import');
const postCSSNext = require('postcss-cssnext');

// Aliases for CSS @import rules (relative to this file)
const aliases = {
  'variables.css': './src/styles/variables.css',
  'elements.css': './src/styles/elements.css',
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
    postCSSNext(),
  ],
};
