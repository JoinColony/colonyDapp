import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import Button, { ActionButton, IconButton } from '~core/Button';
import { ColonyExtensionQuery } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

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

interface Props {
  colonyAddress: Address;
  extension: ExtensionData;
  installedExtension?: ColonyExtensionQuery['colonyExtension'] | null;
}

const ExtensionActionButton = ({
  colonyAddress,
  extension,
  installedExtension,
}: Props) => {
  const history = useHistory();
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();

  const handleEnableButtonClick = useCallback(() => {
    history.push(`/colony/${colonyName}/extensions/${extensionId}/setup`);
  }, [colonyName, extensionId, history]);

  if (!installedExtension) {
    return (
      <ActionButton
        appearance={{ theme: 'primary', size: 'medium' }}
        button={IconButton}
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

  if (installedExtension.details.deprecated) {
    return null;
  }

  if (!installedExtension.details.initialized) {
    return (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        onClick={handleEnableButtonClick}
        text={MSG.enable}
      />
    );
  }
  if (installedExtension.details.missingPermissions.length) {
    return (
      <ActionButton
        button={IconButton}
        submit={ActionTypes.COLONY_EXTENSION_ENABLE}
        error={ActionTypes.COLONY_EXTENSION_ENABLE_ERROR}
        success={ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS}
        values={{
          colonyAddress,
          extensionId: extension.extensionId,
        }}
        text={MSG.enable}
      />
    );
  }
  return null;
};

export default ExtensionActionButton;
