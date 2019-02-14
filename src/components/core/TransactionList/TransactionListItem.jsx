/* @flow */

import React from 'react';
import { defineMessages, FormattedDate } from 'react-intl';
import { compose, withProps } from 'recompose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { TableRow, TableCell } from '../Table';
import Numeral from '../Numeral';
import Button from '../Button';
import Icon from '../Icon';
import ExternalLink from '../ExternalLink';
import TransactionDetails from './TransactionDetails.jsx';

import {
  withColony,
  withColonyENSName,
  withTask,
  withToken,
  withUser,
  withUsername,
} from '~redux/hocs';

import styles from './TransactionListItem.css';

import type {
  ColonyType,
  ContractTransactionType,
  DataType,
  TaskType,
  TokenType,
  UserType,
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

type Props = {|
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: ContractTransactionType,
  colony?: DataType<ColonyType>,
  task?: TaskType,
  token?: TokenType,
  user?: DataType<UserType>,
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
  onClaim?: ContractTransactionType => any,
  /*
   * If to show the button to link to etherscan (or not)
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Claim* button won't show up anymore
   */
  linkToEtherscan: boolean,
|};

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
          // TODO: what should we show when we don't recognise the token?
          suffix={` ${token ? token.symbol : '???'}`}
        />
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

/*
 * TODO: in the future, come up with a better way of providing this data to the
 * component. Many recompose wrappers is potentially bad for performance.
 * Soon-to-be-arriving React Hooks could offer a nicer solution here.
 */
export default compose(
  withProps(
    ({
      transaction: { colonyENSName, taskId, token, from, to, incoming },
    }) => ({
      ensName: colonyENSName,
      taskId,
      tokenAddress: token,
      userAddress: incoming ? from : to,
      colonyAddress: incoming ? from : to,
    }),
  ),
  withColonyENSName,
  withColony,
  withTask,
  withToken,
  withUsername,
  withUser,
  withImmutablePropsToJS,
)(TransactionListItem);
