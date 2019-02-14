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
        './src/components/core/Alert/Alert.jsx',
        './src/components/core/Heading/Heading.jsx',
        './src/components/core/UserMention/UserMention.jsx',
        './src/components/core/Link/Link.jsx',
        './src/components/core/NavLink/NavLink.jsx',
        './src/components/core/ExternalLink/ExternalLink.jsx',
        './src/components/core/Numeral/Numeral.jsx',
        './src/components/core/Duration/Duration.jsx',
        './src/components/core/TimeRelative/TimeRelative.jsx',
      ],
    },
    {
      name: 'Images and Icons',
      components: [
        './src/components/core/Icon/Icon.jsx',
        './src/components/core/QRCode/QRCode.jsx',
        './src/components/core/StarRating/StarRating.jsx',
        // TODO are these really core?
        './src/components/core/ColonyAvatar/ColonyAvatar.jsx',
        './src/components/core/UserAvatar/UserAvatarDisplay.jsx',
        './src/components/core/AvatarUploader/AvatarUploader.jsx',
        './src/components/core/UserAvatar/UserAvatar.jsx',
      ],
    },
    {
      name: 'Elements and Widgets',
      components: [
        './src/components/core/ActivityFeed/ActivityFeed.jsx',
        './src/components/core/CopyableAddress/CopyableAddress.jsx',
        './src/components/core/MaskedAddress/MaskedAddress.jsx',
        './src/components/core/EthUsd/EthUsd.jsx',
        './src/components/core/ColonyGrid/ColonyGrid.jsx',
        './src/components/core/PayoutsList/PayoutsList.jsx',
        './src/components/core/UserInfo/UserInfo.jsx',
        './src/components/core/Assignment/Assignment.jsx',
        './src/components/core/ItemsList/ItemsList.jsx',
        './src/components/core/GroupList/GroupList.jsx',
      ],
    },
    {
      name: 'Forms',
      components: [
        './src/components/core/Fields/Form/Form.jsx',
        './src/components/core/Fields/Form/ActionForm.jsx',
        './src/components/core/Fields/FieldSet/FieldSet.jsx',
        './src/components/core/Fields/Input/Input.jsx',
        './src/components/core/Fields/Input/InputComponent.jsx',
        './src/components/core/Fields/InputLabel/InputLabel.jsx',
        './src/components/core/Fields/InputStatus/InputStatus.jsx',
        './src/components/core/Fields/InlineEdit/SingleLineEdit/SingleLineEdit.jsx',
        './src/components/core/Fields/InlineEdit/MultiLineEdit/MultiLineEdit.jsx',
        './src/components/core/Fields/Textarea/Textarea.jsx',
        './src/components/core/Fields/Textarea/TextareaAutoresize.jsx',
        './src/components/core/Fields/Checkbox/Checkbox.jsx',
        './src/components/core/Fields/Radio/Radio.jsx',
        './src/components/core/Fields/RadioGroup/RadioGroup.jsx',
        './src/components/core/Fields/Select/Select.jsx',
        './src/components/core/Fields/FormStatus/FormStatus.jsx',
        './src/components/core/Button/Button.jsx',
        './src/components/core/FileUpload/FileUpload.jsx',
        './src/components/core/MnemonicGenerator/MnemonicGenerator.jsx',
        './src/components/core/MnemonicDnDSorter/MnemonicDnDSorter.jsx',
      ],
      content: 'docs/Forms.md',
    },
    {
      name: 'Menus',
      components: ['./src/components/core/DropdownMenu/DropdownMenu.jsx'],
    },
    {
      name: 'Cards',
      components: [
        './src/components/core/Card/Card.jsx',
        './src/components/core/CardList/CardList.jsx',
      ],
    },
    {
      name: 'Comboboxes / Pickers',
      components: [
        './src/components/core/OmniPicker/OmniPicker.jsx',
        './src/components/core/SingleUserPicker/SingleUserPicker.jsx',
        './src/components/core/DatePicker/DatePicker.jsx',
      ],
    },
    {
      name: 'Popovers, Modals & Dialogs',
      components: [
        './src/components/core/Modal/Modal.jsx',
        './src/components/core/Dialog/Dialog.jsx',
        './src/components/core/Dialog/DialogProvider.jsx',
        './src/components/core/Dialog/DialogLink.jsx',
        './src/components/core/Dialog/DialogSection.jsx',
        './src/components/core/Dialog/ConfirmDialog.jsx',
        './src/components/core/ActivityBar/ActivityBar.jsx',
        './src/components/core/Popover/Popover.jsx',
        './src/components/core/Popover/Tooltip.jsx',
        './src/components/core/Popover/PopoverProvider.jsx',
        './src/components/core/Popover/RegisteredPopover.jsx',
      ],
    },
    {
      name: 'Tables',
      components: ['./src/components/core/Table/Table.jsx'],
    },
    {
      name: 'Tabs',
      components: [
        './src/components/core/Tabs/Tabs.jsx',
        './src/components/core/Tabs/Tab.jsx',
        './src/components/core/Tabs/TabList.jsx',
        './src/components/core/Tabs/TabPanel.jsx',
      ],
    },
    {
      name: 'Loaders & Progress',
      components: [
        './src/components/core/Preloaders/LogoLoader.jsx',
        './src/components/core/Preloaders/SpinnerLoader.jsx',
        './src/components/core/ProgressBar/ProgressBar.jsx',
        './src/components/core/ProgressBar/StepBar.jsx',
      ],
    },
    {
      name: 'Wizard',
      components: ['./src/components/core/DecisionHub/DecisionHub.jsx'],
    },
    {
      name: 'Errors',
      components: ['./src/components/core/ErrorBoundry/ErrorBoundry.jsx'],
    },
  ],
};
