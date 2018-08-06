// @flow
const path = require('path');

module.exports = {
  title: 'Colony UI Style Guide',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/Wrapper.jsx'),
  },
  sections: [
    {
      name: 'Typography',
      components: ['./src/modules/core/components/Heading/Heading.jsx'],
    },
    {
      name: 'Content',
      components: ['./src/modules/core/components/Icon/Icon.jsx'],
    },
    {
      name: 'Forms',
      components: [
        './src/modules/core/components/Fields/Input/Input.jsx',
        './src/modules/core/components/Fields/InputLabel/InputLabel.jsx',
        './src/modules/core/components/Button/Button.jsx',
        './src/modules/core/components/MnemonicGenerator/MnemonicGenerator.jsx',
        './src/modules/core/components/MnemonicDnDSorter/MnemonicDnDSorter.jsx',
      ],
      content: 'docs/Forms.md',
    },
    {
      name: 'Popovers & Modals',
      components: [
        './src/modules/core/components/Popover/Popover.jsx',
        './src/modules/core/components/Popover/Tooltip.jsx',
      ],
    },
    {
      name: 'Loaders & Progress',
      components: [
        './src/modules/core/components/Preloaders/LogoLoader.jsx',
        './src/modules/core/components/Preloaders/SpinnerLoader.jsx',
        './src/modules/core/components/ProgressBar/ProgressBar.jsx',
        './src/modules/core/components/ProgressBar/StepBar.jsx',
      ],
    },
  ],
};
