/* @flow */

import React from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import Icon from '~core/Icon';
import ExternalLink from '~core/ExternalLink';
import { useDataFetcher } from '~utils/hooks';

import { userFetcher } from '../../../users/fetchers';

import TransactionDetails from './TransactionDetails.jsx';

import styles from './TransactionListItem.css';

import type {
  ColonyType,
  ContractTransactionType,
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
  colony?: ColonyType,
  task?: TaskType,
  token?: TokenType,
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
  showMaskedAddress = true,
  incoming = true,
  onClaim,
  linkToEtherscan,
}: Props) => {
  const { date, amount } = transaction;
  const { data: user, isFetching } = useDataFetcher<UserType>(
    userFetcher,
    [transaction.from],
    [transaction.from],
  );

  if (!user || isFetching) {
    // TODO: ideally we would like to show some sort of loader
    return null;
  }

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

export default TransactionListItem;
