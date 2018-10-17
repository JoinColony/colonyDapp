/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import Button from '~core/Button';

import styles from './TransactionListItem.css';

const MSG = defineMessages({
  buttonClaim: {
    id: 'admin.TransactionList.TransactionListItem.buttonClaim',
    defaultMessage: 'Claim',
  },
});

const displayName = 'admin.TransactionList.TransactionListItem';

type Props = {
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: Object,
  /*
   *
   */
  onClaim: Object => any,
};

const TransactionListItem = ({
  transaction: { id, username = '', fullName = '' },
  onClaim,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell>
      date
    </TableCell>
    <TableCell>
      action icon
    </TableCell>
    <TableCell>
      Text
    </TableCell>
    <TableCell className={styles.userRemove}>
      <Button
        className={styles.customRemoveButton}
        appearance={{ theme: 'primary' }}
        text={MSG.buttonClaim}
        onClick={onClaim}
      />
    </TableCell>
  </TableRow>
);

TransactionListItem.displayName = displayName;

export default TransactionListItem;
