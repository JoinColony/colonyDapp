import React from 'react';
import { useParams } from 'react-router-dom';

import Community from '~dashboard/Community';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList/SubscribedColoniesList';
import { useColonyFromNameQuery } from '~data/index';
import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const ColonyMembers = () => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return (
    <div className={styles.main}>
      <div className={styles.colonyList}>
        <SubscribedColoniesList />
      </div>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.colony && (
            <Community colony={colonyData.colony} />
          )}
        </div>
        <aside className={styles.rightAside}>Edit permissions</aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
