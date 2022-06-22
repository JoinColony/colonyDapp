import { useState, useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { isEmpty } from 'lodash';

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
      const user1Roles = [...user1.roles];
      const user2Roles = [...user2.roles];

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

      if (isEmpty(user1Roles) && isEmpty(user2Roles)) {
        return 0;
      }
      if (isEmpty(user1Roles)) {
        return 1;
      }
      if (isEmpty(user2Roles)) {
        return -1;
      }

      if (sortingMethod === SORTING_METHODS.BY_HIGHEST_ROLE_ID) {
        user1Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleB - roleA,
        );
        user2Roles.sort(
          (roleA: ColonyRole, roleB: ColonyRole) => roleB - roleA,
        );
        return user2Roles[0] - user1Roles[0];
      }
      if (sortingMethod === SORTING_METHODS.BY_LOWEST_ROLE_ID) {
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
  }, [sortingMethod, members, isContributorsSection]);

  return {
    sortedMembers: sortedUsers,
    handleSortingMethodChange: setSortingMethod,
    sortingMethod,
  };
};

export default useColonyMembersSorting;
