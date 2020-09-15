import React, { useCallback } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import { ActionButton } from '~core/Button';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import TransactionLink from '~core/TransactionLink';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { useUserLazy, useTokenQuery, ColonyTransaction } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import TransactionDetails from './TransactionDetails';

import styles from './TransactionListItem.css';

const MSG = defineMessages({
  buttonClaim: {
    id: 'admin.TransactionList.TransactionListItem.buttonClaim',
    defaultMessage: 'Claim',
  },
  buttonEtherscan: {
    id: 'admin.TransactionList.TransactionListItem.buttonEtherscan',
    defaultMessage: 'Blockscout',
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
  transaction: ColonyTransaction;

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

  const user = useUserLazy(userAddress || undefined);

  const { data: tokenData } = useTokenQuery({
    variables: { address: tokenAddress },
  });

  const transform = useCallback(mergePayload({ colonyAddress, tokenAddress }), [
    colonyAddress,
    tokenAddress,
  ]);

  // @TODO: use proper preloader
  if (!tokenData) return null;

  const { token } = tokenData;

  return (
    <TableRow className={styles.main}>
      <TableCell className={styles.transactionDate}>
        <div>
          <div className={styles.dateDay}>
            <FormattedDate value={date} day="numeric" />
          </div>
          <div className={styles.dateMonth}>
            <FormattedDate value={date} month="short" />
          </div>
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
          user={user}
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
            <TransactionLink
              className={styles.mobileLink}
              hash={transaction.hash}
              text={MSG.buttonEtherscan}
            />
          </div>
        )}
        <Numeral
          value={amount}
          unit={getTokenDecimalsWithFallback(token.decimals)}
          suffix={` ${token.symbol}`}
        />
      </TableCell>
    </TableRow>
  );
};

TransactionListItem.displayName = displayName;

export default TransactionListItem;
