import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useRouteMatch, useHistory, useParams } from 'react-router';

import Button, { ActionButton } from '~core/Button';
import { ColonyExtensionQuery } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes/index';

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
  colonyAddress: Address;
  extension: ExtensionData;
  installedExtension?: ColonyExtensionQuery['colonyExtension'] | null;
}

const ExtensionActionButton = ({
  canInstall,
  colonyAddress,
  extension,
  installedExtension,
}: Props) => {
  const history = useHistory();
  const { colonyName, extensionId } = useParams();
  const onSetupRoute = useRouteMatch(COLONY_EXTENSION_SETUP_ROUTE);

  const handleEnableButtonClick = useCallback(() => {
    history.push(`/colony/${colonyName}/extensions/${extensionId}/setup`);
  }, [colonyName, extensionId, history]);

  if (!canInstall) return null;

  if (!installedExtension) {
    return (
      <ActionButton
        appearance={{ theme: 'primary', size: 'large' }}
        submit={ActionTypes.COLONY_EXTENSION_INSTALL}
        error={ActionTypes.COLONY_EXTENSION_INSTALL_ERROR}
        success={ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS}
        values={{
          colonyAddress,
          extensionId: extension.extensionId,
        }}
        text={MSG.install}
      />
    );
  }
  // @TODO if no init options, directly create txs
  if (!onSetupRoute && !installedExtension.details.enabled) {
    return (
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        onClick={handleEnableButtonClick}
        text={MSG.enable}
      />
    );
  }
  return null;
};

export default ExtensionActionButton;
