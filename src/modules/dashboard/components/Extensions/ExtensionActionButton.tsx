import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import { ColonyVersion } from '@colony/colony-js';
import { useMediaQuery } from 'react-responsive';

import Button, { ActionButton, IconButton } from '~core/Button';
import { ColonyExtensionQuery } from '~data/index';
import { ExtensionData } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { waitForElement } from '~utils/dom';
import { query700 as query } from '~styles/queries.css';

import { getButtonAction } from './utils';

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
  colonyVersion: string;
  extensionCompatible?: boolean;
}

const ExtensionActionButton = ({
  colonyAddress,
  colonyVersion,
  extension,
  installedExtension,
  extensionCompatible = true,
}: Props) => {
  const history = useHistory();
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();
  const isMobile = useMediaQuery({ query });

  const handleEnableButtonClick = useCallback(async () => {
    history.push(`/colony/${colonyName}/extensions/${extensionId}/setup`);
    // Generate a smooth scroll to `Form` on mobile when clicking `Enable`
    if (isMobile) {
      const offset = (await waitForElement('#enableExtnTitle')).offsetTop;
      window.scrollTo({ top: offset - 20, behavior: 'smooth' });
    }
  }, [colonyName, extensionId, history, isMobile]);

  const isSupportedColonyVersion =
    parseInt(colonyVersion || '1', 10) >= ColonyVersion.LightweightSpaceship;

  if (!installedExtension) {
    return (
      <ActionButton
        appearance={{ theme: 'primary', size: 'medium' }}
        button={IconButton}
        submit={ActionTypes.EXTENSION_INSTALL}
        error={ActionTypes.EXTENSION_INSTALL_ERROR}
        success={ActionTypes.EXTENSION_INSTALL_SUCCESS}
        values={{
          colonyAddress,
          extensionId: extension.extensionId,
        }}
        text={MSG.install}
        disabled={!isSupportedColonyVersion || !extensionCompatible}
        data-test="installExtensionButton"
      />
    );
  }

  if (installedExtension.details?.deprecated) {
    return null;
  }

  if (!installedExtension.details?.initialized) {
    return (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        onClick={handleEnableButtonClick}
        text={MSG.enable}
        disabled={!isSupportedColonyVersion}
        data-test="enableExtensionButton"
      />
    );
  }
  if (installedExtension.details?.missingPermissions.length) {
    return (
      <ActionButton
        button={IconButton}
        submit={getButtonAction('SUBMIT')}
        error={getButtonAction('ERROR')}
        success={getButtonAction('SUCCESS')}
        values={{
          colonyAddress,
          extensionId: extension.extensionId,
        }}
        text={MSG.enable}
        disabled={!isSupportedColonyVersion}
      />
    );
  }
  return null;
};

export default ExtensionActionButton;
