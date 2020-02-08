/* eslint-disable */

const path = require('path');
const webpackConfig = require('./webpack.config.js');
const propsParser = require('react-docgen-typescript')
  .withCustomConfig('./tsconfig.json', {})
  .parse;
const { findAllComponentDefinitions } = require('react-docgen').resolver;

module.exports = {
  title: 'Colony UI Style Guide',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/Wrapper.tsx'),
  },
  resolver: findAllComponentDefinitions,
  webpackConfig,
  propsParser,
  sections: [
    {
      name: 'Component conventions',
      content: 'docs/Components.md',
    },
    {
      name: 'Typography',
      components: [
        './src/modules/core/components/Alert/Alert.tsx',
        './src/modules/core/components/Heading/Heading.tsx',
        './src/modules/core/components/UserMention/UserMention.tsx',
        './src/modules/core/components/Link/Link.tsx',
        './src/modules/core/components/NavLink/NavLink.tsx',
        './src/modules/core/components/ExternalLink/ExternalLink.tsx',
        './src/modules/core/components/TransactionLink/TransactionLink.tsx',
        './src/modules/core/components/WalletLink/WalletLink.tsx',
        './src/modules/core/components/Numeral/Numeral.tsx',
        './src/modules/core/components/Duration/Duration.tsx',
        './src/modules/core/components/TimeRelative/TimeRelative.tsx',
        './src/modules/core/components/ExpandedParagraph/ExpandedParagraph.tsx',
      ],
    },
    {
      name: 'Images and Icons',
      components: [
        './src/modules/core/components/Icon/Icon.tsx',
        './src/modules/core/components/QRCode/QRCode.tsx',
        './src/modules/core/components/StarRating/StarRating.tsx',
        './src/modules/core/components/ColonyAvatar/ColonyAvatar.tsx',
        './src/modules/core/components/AvatarUploader/AvatarUploader.tsx',
        './src/modules/core/components/UserAvatar/UserAvatar.tsx',
      ],
    },
    {
      name: 'Elements and Widgets',
      components: [
        './src/modules/core/components/ActivityFeed/ActivityFeed.tsx',
        './src/modules/core/components/CopyableAddress/CopyableAddress.tsx',
        './src/modules/core/components/MaskedAddress/MaskedAddress.tsx',
        './src/modules/core/components/EthUsd/EthUsd.tsx',
        './src/modules/core/components/PayoutsList/PayoutsList.tsx',
        './src/modules/core/components/InfoPopover/InfoPopover.tsx',
        './src/modules/core/components/Assignment/Assignment.tsx',
        './src/modules/core/components/ItemsList/ItemsList.tsx',
        './src/modules/core/components/GroupList/GroupList.tsx',
      ],
    },
    {
      name: 'Forms',
      components: [
        './src/modules/core/components/Fields/Form/Form.tsx',
        './src/modules/core/components/Fields/Form/ActionForm.tsx',
        './src/modules/core/components/Fields/FieldSet/FieldSet.tsx',
        './src/modules/core/components/Fields/Input/Input.tsx',
        './src/modules/core/components/Fields/Input/InputComponent.tsx',
        './src/modules/core/components/Fields/InputLabel/InputLabel.tsx',
        './src/modules/core/components/Fields/InputStatus/InputStatus.tsx',
        './src/modules/core/components/Fields/InlineEdit/SingleLineEdit/SingleLineEdit.tsx',
        './src/modules/core/components/Fields/InlineEdit/MultiLineEdit/MultiLineEdit.tsx',
        './src/modules/core/components/Fields/Textarea/Textarea.tsx',
        './src/modules/core/components/Fields/Textarea/TextareaAutoresize.tsx',
        './src/modules/core/components/Fields/Checkbox/Checkbox.tsx',
        './src/modules/core/components/Fields/Radio/Radio.tsx',
        './src/modules/core/components/Fields/RadioGroup/RadioGroup.tsx',
        './src/modules/core/components/Fields/Select/Select.tsx',
        './src/modules/core/components/Fields/FormStatus/FormStatus.tsx',
        './src/modules/core/components/Button/Button.tsx',
        './src/modules/core/components/Button/IconButton.tsx',
        './src/modules/core/components/FileUpload/FileUpload.tsx',
        './src/modules/core/components/MnemonicGenerator/MnemonicGenerator.tsx',
        './src/modules/core/components/MnemonicDnDSorter/MnemonicDnDSorter.tsx',
      ],
      content: 'docs/Forms.md',
    },
    {
      name: 'Menus',
      components: [
        './src/modules/core/components/DropdownMenu/DropdownMenu.tsx',
      ],
    },
    {
      name: 'Cards',
      components: [
        './src/modules/core/components/Card/Card.tsx',
        './src/modules/core/components/CardList/CardList.tsx',
      ],
    },
    {
      name: 'Comboboxes / Pickers',
      components: [
        './src/modules/core/components/OmniPicker/OmniPicker.tsx',
        './src/modules/core/components/SingleUserPicker/SingleUserPicker.tsx',
        './src/modules/core/components/DatePicker/DatePicker.tsx',
      ],
    },
    {
      name: 'Popovers, Modals & Dialogs',
      components: [
        './src/modules/core/components/Modal/Modal.tsx',
        './src/modules/core/components/Dialog/Dialog.tsx',
        './src/modules/core/components/Dialog/DialogProvider.tsx',
        './src/modules/core/components/Dialog/DialogLink.tsx',
        './src/modules/core/components/Dialog/DialogSection.tsx',
        './src/modules/core/components/Dialog/ConfirmDialog.tsx',
        './src/modules/core/components/ActivityBar/ActivityBar.tsx',
        './src/modules/core/components/Popover/Popover.tsx',
        './src/modules/core/components/Popover/Tooltip.tsx',
        './src/modules/core/components/Popover/PopoverProvider.tsx',
        './src/modules/core/components/Popover/RegisteredPopover.tsx',
      ],
    },
    {
      name: 'Tables',
      components: ['./src/modules/core/components/Table/Table.tsx'],
    },
    {
      name: 'Tabs',
      components: [
        './src/modules/core/components/Tabs/Tabs.tsx',
        './src/modules/core/components/Tabs/Tab.tsx',
        './src/modules/core/components/Tabs/TabList.tsx',
        './src/modules/core/components/Tabs/TabPanel.tsx',
      ],
    },
    {
      name: 'Loaders & Progress',
      components: [
        './src/modules/core/components/Preloaders/LogoLoader.tsx',
        './src/modules/core/components/Preloaders/SpinnerLoader.tsx',
        './src/modules/core/components/Preloaders/DotsLoader.tsx',
        './src/modules/core/components/ProgressBar/ProgressBar.tsx',
        './src/modules/core/components/ProgressBar/StepBar.tsx',
      ],
    },
    {
      name: 'Wizard',
      components: ['./src/modules/core/components/DecisionHub/DecisionHub.tsx'],
    },
  ],
};
