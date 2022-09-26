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
import { SimpleMessageValues } from '~types/index';

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

  const isDisabled =
    !isSupportedColonyVersion ||
    !isNetworkAllowed ||
    !hasRegisteredProfile ||
    !isDeploymentFinished ||
    mustUpgradeOneTx;

  interface FIProps {
    text: SimpleMessageValues;
    handleClick: () => void;
    disabled: boolean;
  }

  const FundingItem = ({ text, handleClick, disabled }: FIProps) => (
    <li>
      <Button
        text={text}
        appearance={{ theme: 'blue' }}
        onClick={handleClick}
        disabled={isDisabled || disabled}
      />
    </li>
  );
  return (
    <ul className={styles.main}>
      <FundingItem
        text={MSG.navItemMoveTokens}
        handleClick={handleMoveTokens}
        disabled={!canMoveTokens}
      />
      <FundingItem
        text={MSG.navItemMintNewTokens}
        handleClick={handleMintTokens}
        disabled={!canUserMintNativeToken}
      />
      <FundingItem
        text={MSG.navItemManageTokens}
        handleClick={handleEditTokens}
        disabled={!canEdit}
      />
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
