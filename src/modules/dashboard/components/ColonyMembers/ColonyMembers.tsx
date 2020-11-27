import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Members from '~dashboard/Members';
import { useColonyFromNameQuery } from '~data/index';
import { TokenInfoProvider } from '~utils/hooks/use-token-info';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';

import PermissionManagementDialog from '../PermissionManagementDialog';

import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.ColonyMembers.editPermissions',
    defaultMessage: 'Edit permissions',
  },
});

const ColonyMembers = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    openPermissionManagementDialog({
      colonyAddress: colonyData?.colony.colonyAddress || '',
    });
  }, [openPermissionManagementDialog, colonyData]);

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.colony && (
            <Members colony={colonyData.colony} />
          )}
        </div>
        <aside className={styles.rightAside}>
          <Button
            appearance={{ theme: 'blue' }}
            text={MSG.editPermissions}
            onClick={handlePermissionManagementDialog}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
