import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import Members from '~dashboard/Members';
import { useColonyFromNameQuery, useLoggedInUser } from '~data/index';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import PermissionManagementDialog from '~dashboard/PermissionManagementDialog';
import { ALLOWED_NETWORKS } from '~constants';

import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.ColonyMembers.editPermissions',
    defaultMessage: 'Edit permissions',
  },
});

const ColonyMembers = () => {
  const { networkId } = useLoggedInUser();

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    openPermissionManagementDialog({
      colonyAddress: colonyData?.processedColony.colonyAddress || '',
    });
  }, [openPermissionManagementDialog, colonyData]);

  const isSupportedColonyVersion =
    parseInt(colonyData?.processedColony?.version || '1', 10) >=
    ColonyVersion.CeruleanLightweightSpaceship;
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];

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
            disabled={!isSupportedColonyVersion || !isNetworkAllowed}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
