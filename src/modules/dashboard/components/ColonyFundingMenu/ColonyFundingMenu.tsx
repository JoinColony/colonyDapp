import { ColonyRole, ROOT_DOMAIN_ID, ColonyVersion } from '@colony/colony-js';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import TransferFundsDialog from '~dashboard/TransferFundsDialog';
import ColonyTokenManagementDialog from '~dashboard/ColonyTokenManagementDialog';
import TokenMintDialog from '~dashboard/TokenMintDialog';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';
import { ALLOWED_NETWORKS } from '~constants';

import styles from './ColonyFundingMenu.css';

const MSG = defineMessages({
  navItemMoveTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemMoveTokens',
    defaultMessage: 'Move funds',
  },
  navItemMintNewTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemMintNewTokens',
    defaultMessage: 'Mint tokens',
  },
  navItemManageTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemManageTokens',
    defaultMessage: 'Manage tokens',
  },
});

interface Props {
  colony: Colony;
  selectedDomainId: number;
}

const displayName = 'dashboard.ColonyFundingMenu';

const ColonyFundingMenu = ({
  colony: { canMintNativeToken, version, isDeploymentFinished, colonyAddress },
  colony,
  selectedDomainId,
}: Props) => {
  const { walletAddress, networkId, ethereal, username } = useLoggedInUser();
  const { isVotingExtensionEnabled } = useEnabledExtensions({ colonyAddress });

  const openTokenManagementDialog = useDialog(ColonyTokenManagementDialog);
  const openTokenMintDialog = useDialog(TokenMintDialog);
  const openTokensMoveDialog = useDialog(TransferFundsDialog);

  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const handleEditTokens = useCallback(
    () =>
      openTokenManagementDialog({
        colony,
      }),
    [openTokenManagementDialog, colony],
  );
  const handleMintTokens = useCallback(() => {
    openTokenMintDialog({
      colony,
      isVotingExtensionEnabled,
    });
  }, [colony, openTokenMintDialog, isVotingExtensionEnabled]);
  const handleMoveTokens = useCallback(
    () =>
      openTokensMoveDialog({
        colony,
        fromDomain: selectedDomainId,
      }),
    [colony, openTokensMoveDialog, selectedDomainId],
  );

  const canEdit =
    userHasRole(rootRoles, ColonyRole.Root) ||
    userHasRole(rootRoles, ColonyRole.Administration);
  const canMoveTokens = userHasRole(rootRoles, ColonyRole.Funding);

  const hasRegisteredProfile = !!username && !ethereal;
  const isSupportedColonyVersion =
    parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];

  return (
    <ul className={styles.main}>
      <li>
        <Button
          text={MSG.navItemMoveTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMoveTokens}
          disabled={
            !canMoveTokens ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished
          }
        />
      </li>
      <li>
        <Button
          text={MSG.navItemMintNewTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMintTokens}
          disabled={
            !canMintNativeToken ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished
          }
        />
      </li>
      <li>
        <Button
          text={MSG.navItemManageTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleEditTokens}
          disabled={
            !canEdit ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished
          }
        />
      </li>
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
