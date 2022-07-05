import React, { useCallback } from 'react';
import { ColonyVersion, extensionsIncompatibilityMap } from '@colony/colony-js';

import { ActionButton } from '~core/Button';
import { Colony, useLoggedInUser } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';

interface Props {
  colony: Colony;
  extension: ExtensionData;
  canUpgrade?: boolean;
}

const ExtensionActionButton = ({
  colony: { colonyAddress, version: colonyVersion },
  extension,
  canUpgrade = false,
}: Props) => {
  const { username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      extensionId: extension.extensionId,
      version: extension.currentVersion + 1,
    })),
    [],
  );

  const isSupportedColonyVersion =
    parseInt(colonyVersion || '1', 10) >= ColonyVersion.LightweightSpaceship;

  const nextVersionIncompatibilityMappingExists =
    extensionsIncompatibilityMap[extension.extensionId] &&
    extensionsIncompatibilityMap[extension.extensionId][
      extension.currentVersion + 1
    ];
  const extensionCompatible =
    extension?.currentVersion && nextVersionIncompatibilityMappingExists
      ? !extensionsIncompatibilityMap[extension.extensionId][
          extension.currentVersion + 1
        ].find((version: number) => version === parseInt(colonyVersion, 10))
      : false;

  if (!hasRegisteredProfile) {
    return null;
  }

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      submit={ActionTypes.EXTENSION_UPGRADE}
      error={ActionTypes.EXTENSION_UPGRADE_ERROR}
      success={ActionTypes.EXTENSION_UPGRADE_SUCCESS}
      transform={transform}
      text={{ id: 'button.upgrade' }}
      disabled={
        !isSupportedColonyVersion || !extensionCompatible || !canUpgrade
      }
    />
  );
};

export default ExtensionActionButton;
