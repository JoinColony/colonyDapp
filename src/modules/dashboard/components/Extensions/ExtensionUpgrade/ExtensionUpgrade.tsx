import React, { useCallback } from 'react';
import { ColonyVersion } from '@colony/colony-js';

import { ActionButton } from '~core/Button';
import { Colony } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';

interface Props {
  colony: Colony;
  extension: ExtensionData;
}

const ExtensionActionButton = ({
  colony: { colonyAddress, version },
  extension,
}: Props) => {
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      extensionId: extension.extensionId,
      version: extension.currentVersion + 1,
    })),
    [],
  );

  const isSupportedColonyVersion =
    parseInt(version || '1', 10) >= ColonyVersion.LightweightSpaceship;

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      submit={ActionTypes.COLONY_EXTENSION_UPGRADE}
      error={ActionTypes.COLONY_EXTENSION_UPGRADE_ERROR}
      success={ActionTypes.COLONY_EXTENSION_UPGRADE_SUCCESS}
      transform={transform}
      text={{ id: 'button.upgrade' }}
      disabled={!isSupportedColonyVersion}
    />
  );
};

export default ExtensionActionButton;
