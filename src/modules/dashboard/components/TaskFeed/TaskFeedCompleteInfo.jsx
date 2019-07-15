/* @flow */

// $FlowFixMe until hooks flow types
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import type { TokenType, TaskFeedItemType } from '~immutable';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { tokenFetcher } from '../../fetchers';
import { friendlyUsernameSelector } from '../../../users/selectors';
import { networkFeeInverseSelector } from '../../../core/selectors';

import styles from './TaskFeedCompleteInfo.css';

// const getTaskPayoutTransactionFee = (
//   amount: BigNumber,
//   fee: number,
//   decimals: number,
// ) => amount.mul(fee).div(new BigNumber(10).pow(new BigNumber(decimals)));

// const getTaskPayoutAmountMinusTransactionFee = (
//   amount: BigNumber,
//   fee: number,
//   decimals: number,
// ) => amount.sub(getTaskPayoutTransactionFee(amount, fee, decimals));

const MSG = defineMessages({
  eventTaskSentMessage: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.eventTaskSentMessage',
    defaultMessage: 'Task payment has been sent to {user}',
  },
  receiptAmountText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptAmountText',
    defaultMessage: 'Amount: {amount} {symbol}',
  },
  receiptColonyFeeText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptColonyFeeText',
    defaultMessage: 'Colony fee: {amount} {symbol}',
  },
  receiptRecipientText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptRecipientText',
    defaultMessage: 'Recipient Address: {address}',
  },
  receiptViewTxLinkText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptViewTxLinkText',
    defaultMessage: 'View the task on Etherscan',
  },
});

type Props = {|
  createdAt: Date,
  event: $NonMaybeType<$PropertyType<TaskFeedItemType, 'event'>>,
|};

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  createdAt,
  event: {
    payload: {
      amountPaid,
      // gasLimit,
      // gasPrice,
      paymentTokenAddress,
      workerAddress,
      transactionHash,
    },
  },
}: Props) => {
  const user = useSelector(friendlyUsernameSelector, [workerAddress]);
  const networkFeeInverse = useSelector(networkFeeInverseSelector);
  const {
    data: token,
    isFetching: isFetchingToken,
  } = useDataFetcher<TokenType>(
    tokenFetcher,
    [paymentTokenAddress],
    [paymentTokenAddress],
  );
  const { decimals = 18, symbol } = token || {};
  const getMetaColonyFee = useMemo(
    () => {
      if (new BigNumber(amountPaid).isZero() || networkFeeInverse === 1) {
        return amountPaid;
      }
      return new BigNumber(amountPaid).div(
        new BigNumber(networkFeeInverse).add(new BigNumber(1)),
      );
    },
    [amountPaid, networkFeeInverse],
  );
  const getWorkerPayout = useMemo(
    () => new BigNumber(amountPaid).sub(getMetaColonyFee),
    [amountPaid, getMetaColonyFee],
  );

  return (
    <div className={styles.main}>
      <div className={styles.transactionSentCopy}>
        <p>
          <FormattedMessage
            {...MSG.eventTaskSentMessage}
            values={{
              user: <span className={styles.username}>{user}</span>,
            }}
          />
          <span className={styles.timeSinceTx}>
            <TimeRelative value={createdAt} />
          </span>
        </p>
      </div>
      {isFetchingToken ? (
        <SpinnerLoader />
      ) : (
        <div className={styles.receiptContainer}>
          <div className={styles.receiptSideBorder} />
          <div className={styles.receiptTextBlock}>
            <p>
              <FormattedMessage
                {...MSG.receiptRecipientText}
                values={{
                  address: workerAddress,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptAmountText}
                values={{
                  amount: (
                    <Numeral
                      integerSeparator=""
                      truncate={4}
                      unit={decimals}
                      value={getWorkerPayout}
                    />
                  ),
                  symbol,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptColonyFeeText}
                values={{
                  amount: (
                    <Numeral
                      truncate={4}
                      unit={decimals}
                      value={getMetaColonyFee}
                    />
                  ),
                  symbol,
                }}
              />
              {transactionHash && (
                <>
                  <br />
                  <TransactionLink
                    className={styles.receiptLink}
                    hash={transactionHash}
                    text={MSG.receiptViewTxLinkText}
                  />
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

TaskFeedCompleteInfo.displayName = displayName;

export default TaskFeedCompleteInfo;
