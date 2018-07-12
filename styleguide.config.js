// @flow
const path = require('path');

module.exports = {
  title: 'Colony UI Style Guide',
  // components: '**/[A-Z]*.jsx',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/Wrapper.jsx'),
  },
  sections: [
    {
      name: 'Forms',
      components: [
        './src/components/Fields/Input/Input.jsx',
        './src/components/Fields/InputLabel/InputLabel.jsx',
        './src/components/Button/Button.jsx',
      ],
      content: 'docs/Forms.md',
    },
    {
      name: 'Popovers & Modals',
      components: [
        './src/components/Popover/Popover.jsx'
      ],
    },
  ],
};
