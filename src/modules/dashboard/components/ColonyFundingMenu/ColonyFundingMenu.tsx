import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import TransferFundsDialog from '~dashboard/TransferFundsDialog';
import ColonyTokenManagementDialog from '~dashboard/ColonyTokenManagementDialog';
import TokenMintDialog from '~dashboard/TokenMintDialog';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

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
  colony: { colonyAddress, canMintNativeToken, nativeTokenAddress, tokens },
  colony,
  selectedDomainId,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const openTokenManagementDialog = useDialog(ColonyTokenManagementDialog);
  const openTokenMintDialog = useDialog(TokenMintDialog);
  const openTokensMoveDialog = useDialog(TransferFundsDialog);

  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const canEdit =
    userHasRole(rootRoles, ColonyRole.Root) ||
    userHasRole(rootRoles, ColonyRole.Administration);
  const canMoveTokens = userHasRole(rootRoles, ColonyRole.Funding);

  const handleEditTokens = useCallback(
    () =>
      openTokenManagementDialog({
        colony,
      }),
    [openTokenManagementDialog, colony],
  );
  const handleMintTokens = useCallback(() => {
    openTokenMintDialog({
      colony
    });
  }, [colony]);
  const handleMoveTokens = useCallback(
    () =>
      openTokensMoveDialog({
        colony,
        fromDomain: selectedDomainId,
      }),
    [colony, openTokensMoveDialog, selectedDomainId],
  );

  return (
    <ul className={styles.main}>
      <li>
        <Button
          text={MSG.navItemMoveTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMoveTokens}
          disabled={!canMoveTokens}
        />
      </li>
      <li>
        <Button
          text={MSG.navItemMintNewTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleMintTokens}
          disabled={!canMintNativeToken}
        />
      </li>
      <li>
        <Button
          text={MSG.navItemManageTokens}
          appearance={{ theme: 'blue' }}
          onClick={handleEditTokens}
          disabled={!canEdit}
        />
      </li>
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
