/* @flow */

import React from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import Icon from '~core/Icon';
import TransactionDetails from './TransactionDetails.jsx';

import styles from './TransactionListItem.css';

import type { TransactionType } from '~types/transaction';

const MSG = defineMessages({
  buttonClaim: {
    id: 'admin.TransactionList.TransactionListItem.buttonClaim',
    defaultMessage: 'Claim',
  },
  incomingTransactionTitle: {
    id: 'admin.TransactionList.TransactionListItem.incomingTransactionTitle',
    defaultMessage: 'Incoming Transaction',
  },
  outgoingTransactionTitle: {
    id: 'admin.TransactionList.TransactionListItem.outgoingTransactionTitle',
    defaultMessage: 'Outgoing Transaction',
  },
});

const displayName = 'admin.TransactionList.TransactionListItem';

type Props = {
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: TransactionType,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean,
  /*
   * To mark the transaction as either incoming or outgoing.
   *
   * This value is set by the Transaction list by comparing the transaction's
   * addresses with the current colony's one
   */
  incoming?: boolean,
  /*
   *
   */
  onClaim: Object => any,
};

const TransactionListItem = ({
  transaction,
  showMaskedAddress = true,
  incoming = true,
  onClaim,
}: Props) => {
  const { date, amount, symbol } = transaction;
  return (
    <TableRow className={styles.main}>
      <TableCell className={styles.transactionDate}>
        <div className={styles.dateDay}>
          <FormattedDate value={date} day="numeric" className="hello" />
        </div>
        <div className={styles.dateMonth}>
          <FormattedDate value={date} month="short" />
        </div>
      </TableCell>
      <TableCell className={styles.transactionStatus}>
        {incoming ? (
          <Icon
            name="circle-arrow-down"
            title={MSG.incomingTransactionTitle}
            appearance={{ size: 'medium' }}
          />
        ) : (
          <Icon
            name="circle-arrow-back"
            title={MSG.outgoingTransactionTitle}
            appearance={{ size: 'medium' }}
          />
        )}
      </TableCell>
      <TableCell className={styles.transactionDetails}>
        <TransactionDetails
          transaction={transaction}
          showMaskedAddress={showMaskedAddress}
          incoming={incoming}
        />
      </TableCell>
      <TableCell className={styles.transactionAmountActions}>
        <Numeral
          value={amount}
          unit="ether"
          decimals={1}
          suffix={` ${symbol}`}
        />
        {onClaim && (
          <Button
            className={styles.customRemoveButton}
            appearance={{ theme: 'primary' }}
            text={MSG.buttonClaim}
            onClick={onClaim}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

export default TransactionListItem;
