/* @flow */
/* eslint-disable max-len */

const path = require('path');

module.exports = {
  title: 'Colony UI Style Guide',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/Wrapper.jsx'),
  },
  sections: [
    {
      name: 'Component conventions',
      content: 'docs/Components.md',
    },
    {
      name: 'Typography',
      components: [
        './src/modules/core/components/Alert/Alert.jsx',
        './src/modules/core/components/Heading/Heading.jsx',
        './src/modules/core/components/UserMention/UserMention.jsx',
        './src/modules/core/components/Link/Link.jsx',
        './src/modules/core/components/NavLink/NavLink.jsx',
        './src/modules/core/components/ExternalLink/ExternalLink.jsx',
        './src/modules/core/components/TransactionLink/TransactionLink.jsx',
        './src/modules/core/components/WalletLink/WalletLink.jsx',
        './src/modules/core/components/Numeral/Numeral.jsx',
        './src/modules/core/components/Duration/Duration.jsx',
        './src/modules/core/components/TimeRelative/TimeRelative.jsx',
      ],
    },
    {
      name: 'Images and Icons',
      components: [
        './src/modules/core/components/Icon/Icon.jsx',
        './src/modules/core/components/QRCode/QRCode.jsx',
        './src/modules/core/components/StarRating/StarRating.jsx',
        './src/modules/core/components/ColonyAvatar/ColonyAvatar.jsx',
        './src/modules/core/components/AvatarUploader/AvatarUploader.jsx',
        './src/modules/core/components/UserAvatar/UserAvatar.jsx',
      ],
    },
    {
      name: 'Elements and Widgets',
      components: [
        './src/modules/core/components/ActivityFeed/ActivityFeed.jsx',
        './src/modules/core/components/CopyableAddress/CopyableAddress.jsx',
        './src/modules/core/components/MaskedAddress/MaskedAddress.jsx',
        './src/modules/core/components/EthUsd/EthUsd.jsx',
        './src/modules/core/components/PayoutsList/PayoutsList.jsx',
        './src/modules/core/components/UserInfo/UserInfo.jsx',
        './src/modules/core/components/Assignment/Assignment.jsx',
        './src/modules/core/components/ItemsList/ItemsList.jsx',
        './src/modules/core/components/GroupList/GroupList.jsx',
      ],
    },
    {
      name: 'Forms',
      components: [
        './src/modules/core/components/Fields/Form/Form.jsx',
        './src/modules/core/components/Fields/Form/ActionForm.jsx',
        './src/modules/core/components/Fields/FieldSet/FieldSet.jsx',
        './src/modules/core/components/Fields/Input/Input.jsx',
        './src/modules/core/components/Fields/Input/InputComponent.jsx',
        './src/modules/core/components/Fields/InputLabel/InputLabel.jsx',
        './src/modules/core/components/Fields/InputStatus/InputStatus.jsx',
        './src/modules/core/components/Fields/InlineEdit/SingleLineEdit/SingleLineEdit.jsx',
        './src/modules/core/components/Fields/InlineEdit/MultiLineEdit/MultiLineEdit.jsx',
        './src/modules/core/components/Fields/Textarea/Textarea.jsx',
        './src/modules/core/components/Fields/Textarea/TextareaAutoresize.jsx',
        './src/modules/core/components/Fields/Checkbox/Checkbox.jsx',
        './src/modules/core/components/Fields/Radio/Radio.jsx',
        './src/modules/core/components/Fields/RadioGroup/RadioGroup.jsx',
        './src/modules/core/components/Fields/Select/Select.jsx',
        './src/modules/core/components/Fields/FormStatus/FormStatus.jsx',
        './src/modules/core/components/Button/Button.jsx',
        './src/modules/core/components/FileUpload/FileUpload.jsx',
        './src/modules/core/components/MnemonicGenerator/MnemonicGenerator.jsx',
        './src/modules/core/components/MnemonicDnDSorter/MnemonicDnDSorter.jsx',
      ],
      content: 'docs/Forms.md',
    },
    {
      name: 'Menus',
      components: [
        './src/modules/core/components/DropdownMenu/DropdownMenu.jsx',
      ],
    },
    {
      name: 'Cards',
      components: [
        './src/modules/core/components/Card/Card.jsx',
        './src/modules/core/components/CardList/CardList.jsx',
      ],
    },
    {
      name: 'Comboboxes / Pickers',
      components: [
        './src/modules/core/components/OmniPicker/OmniPicker.jsx',
        './src/modules/core/components/SingleUserPicker/SingleUserPicker.jsx',
        './src/modules/core/components/DatePicker/DatePicker.jsx',
      ],
    },
    {
      name: 'Popovers, Modals & Dialogs',
      components: [
        './src/modules/core/components/Modal/Modal.jsx',
        './src/modules/core/components/Dialog/Dialog.jsx',
        './src/modules/core/components/Dialog/DialogProvider.jsx',
        './src/modules/core/components/Dialog/DialogLink.jsx',
        './src/modules/core/components/Dialog/DialogSection.jsx',
        './src/modules/core/components/Dialog/ConfirmDialog.jsx',
        './src/modules/core/components/ActivityBar/ActivityBar.jsx',
        './src/modules/core/components/Popover/Popover.jsx',
        './src/modules/core/components/Popover/Tooltip.jsx',
        './src/modules/core/components/Popover/PopoverProvider.jsx',
        './src/modules/core/components/Popover/RegisteredPopover.jsx',
      ],
    },
    {
      name: 'Tables',
      components: ['./src/modules/core/components/Table/Table.jsx'],
    },
    {
      name: 'Tabs',
      components: [
        './src/modules/core/components/Tabs/Tabs.jsx',
        './src/modules/core/components/Tabs/Tab.jsx',
        './src/modules/core/components/Tabs/TabList.jsx',
        './src/modules/core/components/Tabs/TabPanel.jsx',
      ],
    },
    {
      name: 'Loaders & Progress',
      components: [
        './src/modules/core/components/Preloaders/LogoLoader.jsx',
        './src/modules/core/components/Preloaders/SpinnerLoader.jsx',
        './src/modules/core/components/Preloaders/DotsLoader.jsx',
        './src/modules/core/components/ProgressBar/ProgressBar.jsx',
        './src/modules/core/components/ProgressBar/StepBar.jsx',
      ],
    },
    {
      name: 'Wizard',
      components: ['./src/modules/core/components/DecisionHub/DecisionHub.jsx'],
    },
    {
      name: 'Errors',
      components: [
        './src/modules/core/components/ErrorBoundry/ErrorBoundry.jsx',
      ],
    },
  ],
};
