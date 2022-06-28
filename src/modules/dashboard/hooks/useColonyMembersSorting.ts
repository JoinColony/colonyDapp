import { useState, useMemo } from 'react';
import Decimal from 'decimal.js';

import { ColonyWatcher, ColonyContributor } from '~data/index';

export enum SORTING_METHODS {
  BY_HIGHEST_REP = 'BY_HIGHEST_REP',
  BY_LOWEST_REP = 'BY_LOWEST_REP',

  BY_HIGHEST_ROLE_ID = 'BY_HIGHEST_ROLE_ID',
  BY_LOWEST_ROLE_ID = 'BY_LOWEST_ROLE_ID',
}

const useColonyMembersSorting = (
  members: ColonyWatcher[] | ColonyContributor[],
  isContributorsSection: boolean,
) => {
  const [sortingMethod, setSortingMethod] = useState<SORTING_METHODS>(
    SORTING_METHODS.BY_HIGHEST_REP,
  );

  const sortedUsers = useMemo(() => {
    if (!isContributorsSection) {
      return members;
    }

    return [...(members as ColonyContributor[])].sort((user1, user2) => {
      if (sortingMethod === SORTING_METHODS.BY_HIGHEST_REP) {
        return new Decimal(user2.userReputation)
          .sub(user1.userReputation)
          .toNumber();
      }
      if (sortingMethod === SORTING_METHODS.BY_LOWEST_REP) {
        return new Decimal(user1.userReputation)
          .sub(user2.userReputation)
          .toNumber();
      }

      if (sortingMethod === SORTING_METHODS.BY_HIGHEST_ROLE_ID) {
        return user2.roles.length - user1.roles.length;
      }
      if (sortingMethod === SORTING_METHODS.BY_LOWEST_ROLE_ID) {
        return user1.roles.length - user2.roles.length;
      }

      return 0;
    });
  }, [sortingMethod, members, isContributorsSection]);

  return {
    sortedMembers: sortedUsers,
    handleSortingMethodChange: setSortingMethod,
    sortingMethod,
  };
};

export default useColonyMembersSorting;
