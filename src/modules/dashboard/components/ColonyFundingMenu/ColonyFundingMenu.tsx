import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import {
  ColonyRole,
  ROOT_DOMAIN_ID,
  ColonyVersion,
  Extension,
} from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import TransferFundsDialog from '~dialogs/TransferFundsDialog';
import ColonyTokenManagementDialog from '~dialogs/ColonyTokenManagementDialog';
import TokenMintDialog from '~dialogs/TokenMintDialog';
import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

import { Colony, useLoggedInUser, useColonyExtensionsQuery } from '~data/index';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { useTransformer } from '~utils/hooks';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

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
  colony: { version, isDeploymentFinished, colonyAddress },
  colony,
  selectedDomainId,
}: Props) => {
  const { walletAddress, networkId, ethereal, username } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const { isVotingExtensionEnabled } = useEnabledExtensions({ colonyAddress });
  const { data } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const openTokenManagementDialog = useDialog(ColonyTokenManagementDialog);
  const openTokenMintDialog = useDialog(TokenMintDialog);
  const openTokensMoveDialog = useDialog(TransferFundsDialog);
  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const handleEditTokens = useCallback(
    () =>
      openTokenManagementDialog({
        colony,
        isVotingExtensionEnabled,
      }),
    [openTokenManagementDialog, colony, isVotingExtensionEnabled],
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
        isVotingExtensionEnabled,
        ethDomainId: selectedDomainId,
      }),
    [colony, openTokensMoveDialog, selectedDomainId, isVotingExtensionEnabled],
  );

  const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const canEdit =
    isVotingExtensionEnabled || userHasRole(rootRoles, ColonyRole.Root);
  const canMoveTokens =
    isVotingExtensionEnabled || userHasRole(rootRoles, ColonyRole.Funding);
  const canUserMintNativeToken = isVotingExtensionEnabled
    ? colony.canColonyMintNativeToken
    : userHasRole(rootRoles, ColonyRole.Root) &&
      colony.canColonyMintNativeToken;

  const hasRegisteredProfile = !!username && !ethereal;
  const isSupportedColonyVersion =
    parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;

  return (
    <ul className={styles.main}>
      <li className={styles.listItem}>
        <Button
          text={MSG.navItemMoveTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMoveTokens}
          disabled={
            !canMoveTokens ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished ||
            mustUpgradeOneTx
          }
        />
      </li>
      <li className={styles.listItem}>
        <Button
          text={MSG.navItemMintNewTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMintTokens}
          disabled={
            !canUserMintNativeToken ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished ||
            mustUpgradeOneTx
          }
        />
      </li>
      <li className={styles.listItem}>
        <Button
          text={MSG.navItemManageTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleEditTokens}
          disabled={
            !canEdit ||
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished ||
            mustUpgradeOneTx
          }
          data-test="manageTokens"
        />
      </li>
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
