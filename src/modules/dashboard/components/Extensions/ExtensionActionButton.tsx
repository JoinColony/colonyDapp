import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~core/Button';
import { ColonyExtensionQuery } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';

const MSG = defineMessages({
  enable: {
    id: 'Extensions.ExtensionActionButton.enable',
    defaultMessage: 'Enable',
  },
  install: {
    id: 'Extensions.ExtensionActionButton.install',
    defaultMessage: 'Install',
  },
});
// - Do not show button if installed and enabling is not possible/necessary
// - Do not show button if not uninstallable
// - Do not show button if user does not have the permission to install/enable
// next steps:
// Button text and action depending on install and enabled status
// - Create saga to install
// - Create modal for initialisation params
// - Create saga to enable

interface Props {
  canInstall: boolean;
  installedExtension?: ColonyExtensionQuery['colonyExtension'] | null;
  extension: ExtensionData;
}

const ExtensionActionButton = ({ canInstall, installedExtension }: Props) => {
  if (!installedExtension) {
    return (
      <ActionButton
        disabled={!canInstall}
        appearance={{ theme: 'primary', size: 'large' }}
        submit={ActionTypes.COLONY_EXTENSION_INSTALL}
        error={ActionTypes.COLONY_EXTENSION_INSTALL_ERROR}
        success={ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS}
        text={MSG.install}
      />
    );
  }
  if (!installedExtension.details.enabled) {
    return (
      <ActionButton
        appearance={{ theme: 'primary', size: 'large' }}
        submit={ActionTypes.COLONY_EXTENSION_ENABLE}
        error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
        success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
        text={MSG.enable}
      />
    );
  }
  return null;
};

export default ExtensionActionButton;
