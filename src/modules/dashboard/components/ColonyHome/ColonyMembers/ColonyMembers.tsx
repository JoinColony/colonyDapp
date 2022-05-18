import React from 'react';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { MiniSpinnerLoader } from '~core/Preloaders';
import { Colony, useContributorsAndWatchersQuery } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import styles from './ColonyMembers.css';
import MembersSubsection from './MembersSubsection';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyMembers.title',
    defaultMessage: 'Members',
  },
  loadingData: {
    id: 'dashboard.ColonyHome.ColonyMembers.loadingData',
    defaultMessage: 'Loading members information...',
  },
});

interface Props {
  colony: Colony;
  currentDomainId?: number;
  maxAvatars?: number;
}

const displayName = 'dashboard.ColonyHome.ColonyMembers';

const ColonyMembers = ({
  colony: { colonyAddress, colonyName },
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars,
}: Props) => {
  const {
    data: members,
    loading: loadingMembers,
  } = useContributorsAndWatchersQuery({
    variables: {
      colonyAddress,
      colonyName,
      domainId: currentDomainId,
    },
  });

  if (loadingMembers) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        title={MSG.title}
        loadingText={MSG.loadingData}
        titleTextValues={{ hasCounter: false }}
      />
    );
  }

  return (
    <>
      <MembersSubsection
        members={members?.contributorsAndWatchers?.contributors}
        colony={colony}
        isContributorsSubsection
      />
      {(currentDomainId === ROOT_DOMAIN_ID ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <MembersSubsection
          members={members?.contributorsAndWatchers?.watchers}
          colony={colony}
          maxAvatars={maxAvatars}
          isContributorsSubsection={false}
        />
      )}
    </>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
