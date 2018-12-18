/* @flow */

import React from 'react';
import { defineMessages, FormattedDate } from 'react-intl';
import { compose, mapProps } from 'recompose';

import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import Icon from '~core/Icon';
import ExternalLink from '~core/ExternalLink';
import TransactionDetails from './TransactionDetails.jsx';

import { withColony, withTask, withToken, withUser } from '../../hocs';

import styles from './TransactionListItem.css';

import type { TransactionType } from '~types';
import type {
  ColonyRecord,
  TaskRecord,
  TokenRecord,
  UserRecord,
} from '~immutable';

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
  colony?: ColonyRecord,
  task?: TaskRecord,
  token?: TokenRecord,
  user?: UserRecord,
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
   * If to show the button to link to etherscan (or not)
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Claim* button won't show up anymore
   */
  linkToEtherscan: boolean,
};

const TransactionListItem = ({
  transaction,
  colony,
  task,
  token,
  user,
  showMaskedAddress = true,
  incoming = true,
  onClaim,
  linkToEtherscan,
}: Props) => {
  const { date, amount } = transaction;
  return (
    <TableRow className={styles.main}>
      <TableCell className={styles.transactionDate}>
        <div className={styles.dateDay}>
          <FormattedDate value={date} day="numeric" />
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
          colony={colony}
          task={task}
          token={token}
          user={user}
          showMaskedAddress={showMaskedAddress}
          incoming={incoming}
        />
      </TableCell>
      <TableCell className={styles.transactionAmountActions}>
        {!linkToEtherscan && onClaim && (
          <div className={styles.buttonWrapper}>
            <Button
              text={MSG.buttonClaim}
              onClick={() => onClaim(transaction)}
              className={styles.customButton}
            />
          </div>
        )}
        {linkToEtherscan && (
          <div className={styles.etherscanButtonWrapper}>
            <ExternalLink
              href={`https://rinkeby.etherscan.io/tx/${transaction.hash || 0}`}
              text={MSG.buttonEtherscan}
              className={styles.customButton}
            />
          </div>
        )}
        <Numeral
          value={amount}
          unit="ether"
          decimals={1}
          suffix={` ${token ? token.symbol : '???'}`}
        />
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

export default compose(
  mapProps(props => ({
    ...props,
    ensName: props.transaction.colonyENSName,
    taskId: props.transaction.taskId,
    tokenAddress: props.transaction.tokenAddress,
    userAddress: props.transaction.userAddress,
  })),
  withColony,
  withTask,
  withToken,
  withUser,
)(TransactionListItem);
