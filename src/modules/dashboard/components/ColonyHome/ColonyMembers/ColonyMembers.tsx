import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { MiniSpinnerLoader } from '~core/Preloaders';
import {
  Colony,
  useColonyMembersWithReputationQuery,
  useMembersSubscription,
  useBannedUsersQuery,
} from '~data/index';
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
  colony: { colonyAddress },
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars = 12,
}: Props) => {
  const {
    data: membersWithReputation,
    loading: loadingColonyMembersWithReputation,
  } = useColonyMembersWithReputationQuery({
    variables: {
      colonyAddress,
      domainId:
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
          ? ROOT_DOMAIN_ID
          : currentDomainId,
    },
  });

  const { data: members, loading: loadingMembers } = useMembersSubscription({
    variables: {
      colonyAddress,
    },
  });

  const {
    data: bannedMembers,
    loading: loadingBannedUsers,
  } = useBannedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  const subscribers = useMemo(() => {
    const allMembers = members?.subscribedUsers?.map(
      ({ profile: { walletAddress } }) => walletAddress.toLowerCase(),
    );

    return (allMembers || []).filter(
      (member) =>
        membersWithReputation?.colonyMembersWithReputation?.indexOf(member) ===
        -1,
    );
  }, [members, membersWithReputation]);

  if (
    loadingColonyMembersWithReputation ||
    loadingMembers ||
    loadingBannedUsers
  ) {
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
        members={membersWithReputation?.colonyMembersWithReputation}
        bannedMembers={bannedMembers?.bannedUsers || []}
        colony={colony}
        isContributors
      />
      {(currentDomainId === ROOT_DOMAIN_ID ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <MembersSubsection
          members={subscribers}
          bannedMembers={bannedMembers?.bannedUsers || []}
          colony={colony}
          maxAvatars={maxAvatars}
          isContributors={false}
        />
      )}
    </>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
