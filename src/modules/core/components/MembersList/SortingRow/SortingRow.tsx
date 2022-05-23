import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Icon from '~core/Icon';

import styles from './SortingRow.css';

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

const SortingRow = () => {
  return (
    <div className={styles.container}>
      <Button className={styles.sortingButton}>
        <FormattedMessage {...MSG.permissions} />
        <Icon
          className={styles.sortingIcon}
          name="caret-down-small"
          title={MSG.permissions}
        />
      </Button>
      <Button className={styles.sortingButton}>
        <FormattedMessage {...MSG.reputation} />
        <Icon
          className={styles.sortingIcon}
          name="caret-down-small"
          title={MSG.reputation}
        />
      </Button>
    </div>
  );
};

SortingRow.displayName = displayName;

export default SortingRow;
