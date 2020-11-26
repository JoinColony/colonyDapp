import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Members from '~dashboard/Members';
import { useColonyFromNameQuery } from '~data/index';
import styles from './ColonyMembers.css';
import { TokenInfoProvider } from '~utils/hooks/use-token-info';
import Button from '~core/Button';

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

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.colony && (
            <TokenInfoProvider colonyAddress={colonyData.colony.colonyAddress}>
              <Members colony={colonyData.colony} />
            </TokenInfoProvider>
          )}
        </div>
        <aside className={styles.rightAside}>
          <Button appearance={{ theme: 'blue' }} text={MSG.editPermissions} />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
