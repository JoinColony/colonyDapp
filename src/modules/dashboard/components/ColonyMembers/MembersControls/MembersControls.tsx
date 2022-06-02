import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyVersion, Extension } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';

import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';

import { Colony, useColonyExtensionsQuery, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

import styles from './MembersControls.css';

const displayName = 'dashboard.MembersControls';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.MembersControls.editPermissions',
    defaultMessage: 'Edit permissions',
  },
  banAddress: {
    id: 'dashboard.MembersControls.banAddress',
    defaultMessage: 'Ban address',
  },
  unbanAddress: {
    id: 'dashboard.MembersControls.unbanAddress',
    defaultMessage: 'Unban address',
  },
});

interface Props {
  colony: Colony;
}

const MembersControls = ({
  colony: { colonyAddress, version, isDeploymentFinished },
  colony,
}: Props) => {
  const {
    networkId,
    username,
    ethereal,
    walletAddress: currentUserWalletAddress,
  } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const hasRegisteredProfile = !!username && !ethereal;

  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);
  const openToggleBanningDialog = useDialog(BanUserDialog);

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  const { data: colonyExtensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    openPermissionManagementDialog({
      colony,
      isVotingExtensionEnabled,
    });
  }, [openPermissionManagementDialog, colony, isVotingExtensionEnabled]);

  // eslint-disable-next-line max-len
  const oneTxPaymentExtension = colonyExtensions?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const isSupportedColonyVersion =
    parseInt(version || '1', 10) >= ColonyVersion.LightweightSpaceship;

  const currentUserRoles = useTransformer(getAllUserRoles, [
    colony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

  const controlsDisabled =
    !isSupportedColonyVersion ||
    !isNetworkAllowed ||
    !hasRegisteredProfile ||
    !isDeploymentFinished ||
    mustUpgradeOneTx;

  return !controlsDisabled ? (
    <ul className={styles.controls}>
      <li>
        <Button
          appearance={{ theme: 'blue' }}
          text={MSG.editPermissions}
          onClick={handlePermissionManagementDialog}
          disabled={
            !isSupportedColonyVersion ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !isDeploymentFinished ||
            mustUpgradeOneTx
          }
        />
      </li>
      {canAdministerComments && (
        <>
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.banAddress}
              onClick={() =>
                openToggleBanningDialog({
                  colonyAddress,
                })
              }
            />
          </li>
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.unbanAddress}
              onClick={() =>
                openToggleBanningDialog({
                  isBanning: false,
                  colonyAddress,
                })
              }
            />
          </li>
        </>
      )}
    </ul>
  ) : null;
};

MembersControls.displayName = displayName;

export default MembersControls;
