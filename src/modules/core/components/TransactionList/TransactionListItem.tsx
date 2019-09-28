import React, { useCallback } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import { ContractTransactionType } from '~immutable/index';
import { TableRow, TableCell } from '~core/Table';
import { ActionButton } from '~core/Button';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import TransactionLink from '~core/TransactionLink';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { tokenFetcher } from '../../../dashboard/fetchers';
import { userSubscriber } from '../../../users/subscribers';
import TransactionDetails from './TransactionDetails';
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

interface Props {
  /*
   * The given contract transaction.
   */
  transaction: ContractTransactionType;

  /*
   * User and colony addresses will always be shown; this controls whether the
   * address is shown in full, or masked.
   */
  showMaskedAddress?: boolean;

  /*
   * If to show the button to link to etherscan (or not). If this is not set,
   * it will not be possible to claim the transaction, as the button will
   * not be visible.
   */
  linkToEtherscan: boolean;
}

const TransactionListItem = ({
  linkToEtherscan,
  showMaskedAddress = true,
  transaction: {
    amount,
    colonyAddress,
    date,
    incoming,
    token: tokenAddress,
    from: senderAddress,
    to: recipientAddress,
  },
  transaction,
}: Props) => {
  const userAddress = incoming ? senderAddress : recipientAddress;
  const { data: user } = useDataSubscriber(
    userSubscriber,
    [userAddress as string],
    [userAddress],
  );

  const { data: token } = useDataFetcher(
    tokenFetcher,
    [tokenAddress],
    [tokenAddress],
  );

  /**
   * @todo Support fetching of tasks by `taskId`
   * */
  // const { data: task } = useDataSubscriber(
  //   taskSubscriber,
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
              submit={ActionTypes.COLONY_CLAIM_TOKEN}
              error={ActionTypes.COLONY_CLAIM_TOKEN_ERROR}
              success={ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS}
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
