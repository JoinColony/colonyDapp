import React, { useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ColonyVersion, Extension } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';

import LoadingTemplate from '~pages/LoadingTemplate';
import Members from '~dashboard/Members';
import PermissionManagementDialog from '~dashboard/PermissionManagementDialog';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';

import {
  useColonyFromNameQuery,
  useLoggedInUser,
  Colony,
  useColonyExtensionsQuery,
} from '~data/index';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { oneTxMustBeUpgraded } from '../../../dashboard/checks';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { ALLOWED_NETWORKS } from '~constants';

import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.ColonyMembers.editPermissions',
    defaultMessage: 'Edit permissions',
  },
  loadingText: {
    id: 'dashboard.ColonyMembers.loadingText',
    defaultMessage: 'Loading Colony',
  },
});

const ColonyMembers = () => {
  const { networkId, username, ethereal } = useLoggedInUser();
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];
  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colonyData?.processedColony?.colonyAddress,
  });

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  const {
    data: colonyExtensions,
    loading: colonyExtensionLoading,
  } = useColonyExtensionsQuery({
    variables: { address: colonyData?.processedColony?.colonyAddress || '' },
  });

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    openPermissionManagementDialog({
      colony: colonyData?.processedColony as Colony,
      isVotingExtensionEnabled,
    });
  }, [openPermissionManagementDialog, colonyData, isVotingExtensionEnabled]);

  // eslint-disable-next-line max-len
  const oneTxPaymentExtension = colonyExtensions?.processedColony?.installedExtensions.find(
    ({
      details: { initialized, missingPermissions },
      extensionId: extensionName,
    }) =>
      initialized &&
      !missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const hasRegisteredProfile = !!username && !ethereal;
  const isSupportedColonyVersion =
    parseInt(colonyData?.processedColony?.version || '1', 10) >=
    ColonyVersion.LightweightSpaceship;

  if (
    loading ||
    colonyExtensionLoading ||
    (colonyData?.colonyAddress &&
      !colonyData.processedColony &&
      !((colonyData.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !colonyData?.processedColony) {
    console.error(error);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.processedColony && (
            <Members colony={colonyData.processedColony} />
          )}
        </div>
        <aside className={styles.rightAside}>
          <Button
            appearance={{ theme: 'blue' }}
            text={MSG.editPermissions}
            onClick={handlePermissionManagementDialog}
            disabled={
              !isSupportedColonyVersion ||
              !isNetworkAllowed ||
              !hasRegisteredProfile ||
              !colonyData?.processedColony?.isDeploymentFinished ||
              mustUpgradeOneTx
            }
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
