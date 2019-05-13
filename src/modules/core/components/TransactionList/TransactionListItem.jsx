/* @flow */

// $FlowFixMe
import React, { useCallback } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import type { ContractTransactionType, TokenType, UserType } from '~immutable';

import { TableRow, TableCell } from '~core/Table';
import { ActionButton } from '~core/Button';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import TransactionLink from '~core/TransactionLink';
import { ACTIONS } from '~redux';
import { mergePayload } from '~utils/actions';
import { useDataFetcher } from '~utils/hooks';

import { tokenFetcher } from '../../../dashboard/fetchers';
import { userFetcher } from '../../../users/fetchers';

import TransactionDetails from './TransactionDetails.jsx';

import styles from './TransactionListItem.css';

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
   * The given contract transaction.
   */
  transaction: ContractTransactionType,
  /*
   * User and colony addresses will always be shown; this controls whether the
   * address is shown in full, or masked.
   */
  showMaskedAddress?: boolean,
  /*
   * If to show the button to link to etherscan (or not). If this is not set,
   * it will not be possible to claim the transaction, as the button will
   * not be visible.
   */
  linkToEtherscan: boolean,
|};

const TransactionListItem = ({
  linkToEtherscan,
  showMaskedAddress = true,
  transaction: { amount, colonyAddress, date, incoming, token: tokenAddress },
  transaction,
}: Props) => {
  const { data: user } = useDataFetcher<UserType>(
    userFetcher,
    [transaction.from],
    [transaction.from],
  );

  const { data: token } = useDataFetcher<TokenType>(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );

  /**
   * @todo Support fetching of tasks by `taskId`
   * */
  // const { data: task } = useDataFetcher<TokenType>(
  //   taskFetcher,
  //   [taskId],
  //   [taskId],
  // );

  const transform = useCallback(mergePayload({ colonyAddress, tokenAddress }), [
    colonyAddress,
    tokenAddress,
  ]);

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
          user={user ? user.profile : undefined}
          showMaskedAddress={showMaskedAddress}
        />
      </TableCell>
      <TableCell className={styles.transactionAmountActions}>
        {!linkToEtherscan && colonyAddress && tokenAddress && (
          <div className={styles.buttonWrapper}>
            <ActionButton
              text={MSG.buttonClaim}
              className={styles.customButton}
              submit={ACTIONS.COLONY_CLAIM_TOKEN}
              error={ACTIONS.COLONY_CLAIM_TOKEN_ERROR}
              success={ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS}
              transform={transform}
            />
          </div>
        )}
        {linkToEtherscan && transaction.hash && (
          <div className={styles.etherscanButtonWrapper}>
            <TransactionLink
              className={styles.customButton}
              hash={transaction.hash}
              text={MSG.buttonEtherscan}
            />
          </div>
        )}
        <Numeral
          value={amount}
          unit="ether"
          truncate={1}
          /**
           * @todo : what should we show when we don't recognise the token?
           */
          suffix={` ${(token && token.symbol) || '???'}`}
        />
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

export default TransactionListItem;
