import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyVersion, Extension } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';

import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';
import ManageWhitelistDialog from '~dashboard/Dialogs/ManageWhitelistDialog';

import { Colony, useColonyExtensionsQuery, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister, canArchitect } from '~modules/users/checks';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

const displayName = 'dashboard.MemberControls';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.MemberControls.editPermissions',
    defaultMessage: 'Edit permissions',
  },
  banAddress: {
    id: 'dashboard.MemberControls.banAddress',
    defaultMessage: 'Ban address',
  },
  unbanAddress: {
    id: 'dashboard.MemberControls.unbanAddress',
    defaultMessage: 'Unban address',
  },
  manageWhitelist: {
    id: 'dashboard.MemberControls.manageWhitelist',
    defaultMessage: 'Manage address book',
  },
});

interface Props {
  colony: Colony;
}

const MemberControls = ({
  colony,
  colony: { colonyAddress, version, isDeploymentFinished },
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
    });
  }, [openPermissionManagementDialog, colony]);

  const openToggleManageWhitelistDialog = useDialog(ManageWhitelistDialog);

  const handleToggleWhitelistDialog = useCallback(() => {
    return openToggleManageWhitelistDialog({
      colony,
    });
  }, [openToggleManageWhitelistDialog, colony]);

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
  const canMamangePermissions =
    (hasRegisteredProfile && canArchitect(currentUserRoles)) ||
    hasRoot(currentUserRoles);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));
  const canManageWhitelist = hasRegisteredProfile && hasRoot(currentUserRoles);

  const controlsDisabled =
    !isSupportedColonyVersion ||
    !isNetworkAllowed ||
    !hasRegisteredProfile ||
    !isDeploymentFinished ||
    mustUpgradeOneTx;

  return (
    <>
      {!controlsDisabled && (
        <>
          {canMamangePermissions && (
            <li>
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.editPermissions}
                onClick={handlePermissionManagementDialog}
              />
            </li>
          )}
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
          {canManageWhitelist && (
            <li>
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.manageWhitelist}
                onClick={handleToggleWhitelistDialog}
              />
            </li>
          )}
        </>
      )}
    </>
  );
};

MemberControls.displayName = displayName;

export default MemberControls;
