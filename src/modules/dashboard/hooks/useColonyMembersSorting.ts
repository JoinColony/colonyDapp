import { useState, useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { SORTING_METHODS } from '~core/MembersList/MembersList';
import {
  Colony,
  ColonyWatcher,
  ColonyContributor,
  useUserReputationLazyQuery,
} from '~data/index';

const useColonyMembersSorting = (
  members: ColonyWatcher[] | ColonyContributor[],
  colony: Colony,
  isContributorsSection: boolean,
  domainId: number,
) => {
  const [sortingMethod, setSortingMethod] = useState<SORTING_METHODS>(
    SORTING_METHODS.BY_HIGHEST_REP,
  );
  const [
    fetchUser1ReputationData,
    { data: user1ReputationData },
  ] = useUserReputationLazyQuery();
  const [
    fetchUser2ReputationData,
    { data: user2ReputationData },
  ] = useUserReputationLazyQuery();

  const sortedUsers = useMemo(() => {
    if (!isContributorsSection) {
      return members;
    }

    return [...(members as ColonyContributor[])].sort((user1, user2) => {
      const isSortingByRep =
        sortingMethod === SORTING_METHODS.BY_HIGHEST_REP ||
        sortingMethod === SORTING_METHODS.BY_LOWEST_REP;
      const user1Roles = [...user1.roles];
      const user2Roles = [...user2.roles];

      if (isSortingByRep) {
        if (!(user1ReputationData && user2ReputationData)) {
          fetchUser1ReputationData({
            variables: {
              address: user1.profile.walletAddress,
              colonyAddress: colony.colonyAddress,
              domainId,
              rootHash: null,
            },
          });
          fetchUser2ReputationData({
            variables: {
              address: user2.profile.walletAddress,
              colonyAddress: colony.colonyAddress,
              domainId,
              rootHash: null,
            },
          });
        } else {
          if (sortingMethod === SORTING_METHODS.BY_HIGHEST_REP) {
            return new Decimal(user2ReputationData.userReputation)
              .sub(user1ReputationData.userReputation)
              .toNumber();
          }
          if (sortingMethod === SORTING_METHODS.BY_LOWEST_REP) {
            return new Decimal(user1ReputationData.userReputation)
              .sub(user2ReputationData.userReputation)
              .toNumber();
          }
        }
      } else if (sortingMethod === SORTING_METHODS.BY_HIGHEST_ROLE_ID) {
        user1Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleB - roleA,
        );
        user2Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleB - roleA,
        );
        return user1Roles[0] - user2Roles[0];
      } else if (sortingMethod === SORTING_METHODS.BY_LOWEST_ROLE_ID) {
        user1Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleA - roleB,
        );
        user2Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleA - roleB,
        );
        return user1Roles[0] - user2Roles[0];
      }

      return 0;
    });
  }, [
    sortingMethod,
    fetchUser1ReputationData,
    fetchUser2ReputationData,
    user1ReputationData,
    user2ReputationData,
    members,
    colony,
    domainId,
    isContributorsSection,
  ]);

  return {
    sortedMembers: sortedUsers,
    handleSortingMethodChange: setSortingMethod,
    sortingMethod,
  };
};

export default useColonyMembersSorting;
