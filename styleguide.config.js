const path = require('path');

module.exports = {
  title: 'Colony UI Style Guide',
  components: 'src/components/**/[A-Z]*.jsx',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/Wrapper.jsx'),
  },
};
