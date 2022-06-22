import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { SORTING_METHODS } from '~modules/dashboard/hooks/useColonyMembersSorting';

import styles from './SortingRow.css';

interface Props {
  sortingMethod: SORTING_METHODS;
  handleSortingMethodChange: React.Dispatch<
    React.SetStateAction<SORTING_METHODS>
  >;
}

const displayName = 'dashboard.MembersList.SortingRow';

const MSG = defineMessages({
  permissions: {
    id: 'dashboard.MembersList.SortingRow.permissions',
    defaultMessage: 'Permissions',
  },
  reputation: {
    id: 'dashboard.MembersList.SortingRow.reputation',
    defaultMessage: 'Reputation',
  },
});

const SortingRow = ({ handleSortingMethodChange, sortingMethod }: Props) => {
  const nextSortingByRepMethod = useMemo(() => {
    switch (sortingMethod) {
      case SORTING_METHODS.BY_HIGHEST_REP:
        return SORTING_METHODS.BY_LOWEST_REP;
      default:
        return SORTING_METHODS.BY_HIGHEST_REP;
    }
  }, [sortingMethod]);
  const nextSortingByRoleMethod = useMemo(() => {
    switch (sortingMethod) {
      case SORTING_METHODS.BY_HIGHEST_ROLE_ID:
        return SORTING_METHODS.BY_LOWEST_ROLE_ID;
      case SORTING_METHODS.BY_LOWEST_ROLE_ID:
        return SORTING_METHODS.BY_HIGHEST_REP;
      default:
        return SORTING_METHODS.BY_HIGHEST_ROLE_ID;
    }
  }, [sortingMethod]);
  const isSortingByRep =
    sortingMethod === SORTING_METHODS.BY_HIGHEST_REP ||
    sortingMethod === SORTING_METHODS.BY_LOWEST_REP;
  return (
    <div className={styles.container}>
      <Button
        className={styles.sortingButton}
        onClick={() => handleSortingMethodChange(nextSortingByRoleMethod)}
      >
        <FormattedMessage {...MSG.permissions} />
        <Icon
          className={classnames(styles.sortingIcon, {
            [styles.toggledIcon]: !isSortingByRep,
          })}
          name={`caret-${
            sortingMethod === SORTING_METHODS.BY_HIGHEST_ROLE_ID ? 'up' : 'down'
          }`}
          title={MSG.permissions}
        />
      </Button>
      <Button
        className={styles.sortingButton}
        onClick={() => handleSortingMethodChange(nextSortingByRepMethod)}
      >
        <FormattedMessage {...MSG.reputation} />
        <Icon
          className={classnames(styles.sortingIcon, {
            [styles.toggledIcon]: isSortingByRep,
          })}
          name={`caret-${
            sortingMethod === SORTING_METHODS.BY_HIGHEST_REP ? 'up' : 'down'
          }`}
          title={MSG.reputation}
        />
      </Button>
    </div>
  );
};

SortingRow.displayName = displayName;

export default SortingRow;
