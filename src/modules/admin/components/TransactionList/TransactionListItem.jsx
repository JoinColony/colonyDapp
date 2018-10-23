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
  buttonEtherscan: {
    id: 'admin.TransactionList.TransactionListItem.buttonEtherscan',
    defaultMessage: 'Etherscan',
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
   * Method to call when clicking the 'Claim' button
   * Only by setting this method, will the actual button show up
   */
  onClaim?: TransactionType => any,
  /*
   * Method to call when clicking the 'Etherscan' button
   * This should. in theory redirect you to etherscan, but it can be customized
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Clain* button won't show up anymore
   */
  onEtherscan?: TransactionType => any,
};

const TransactionListItem = ({
  transaction,
  showMaskedAddress = true,
  incoming = true,
  onClaim,
  onEtherscan,
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
        {!onEtherscan &&
          onClaim && (
            <div className={styles.buttonWrapper}>
              <Button
                text={MSG.buttonClaim}
                onClick={() => onClaim(transaction)}
                className={styles.customButton}
              />
            </div>
          )}
        {onEtherscan && (
          <div className={styles.etherscanButtonWrapper}>
            <Button
              text={MSG.buttonEtherscan}
              onClick={() => onEtherscan(transaction)}
              className={styles.customButton}
            />
          </div>
        )}
        <Numeral
          value={amount}
          unit="ether"
          decimals={1}
          suffix={` ${symbol}`}
        />
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

export default TransactionListItem;
