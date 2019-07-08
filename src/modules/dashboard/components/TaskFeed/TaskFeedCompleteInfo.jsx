/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import BigNumber from 'bn.js';

import type { ContractTransactionType, TokenType } from '~immutable';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';

import { useDataFetcher, useSelector } from '~utils/hooks';
import { useReputationEarned } from '../../hooks/useReputationEarned';
import { tokenFetcher } from '../../fetchers';
import { taskSelector } from '../../selectors';
import { friendlyUsernameSelector } from '../../../users/selectors';
import { transactionByHash } from '../../../core/selectors';

import styles from './TaskFeedCompleteInfo.css';

const getTaskPayoutTransactionFee = (amount: BigNumber, fee: number) =>
  amount.multipliedBy(new BigNumber(fee));

const getTaskPayoutAmountMinusTransactionFee = (
  amount: BigNumber,
  fee: number,
) => amount.minus(getTaskPayoutTransactionFee(amount, fee));

const MSG = defineMessages({
  eventTaskSentMessage: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.eventTaskSentMessage',
    defaultMessage: 'The task has been completed and payment sent to {user}',
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
    defaultMessage: 'Recipient: {address}',
  },
  receiptReputationText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptReputationText',
    defaultMessage: `Reputation:
{isNonNegative, select, true {+} false {}}{reputationAmount} rep`,
  },
  receiptViewTxLinkText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptViewTxLinkText',
    defaultMessage: 'View the task on Etherscan',
  },
});

type Props = {|
  transaction: ContractTransactionType,
|};

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  transaction: { amount, date, hash, taskId, to, token: tokenAddress },
}: Props) => {
  const {
    record: { reputation: taskReputation = 0 },
  } = useSelector(taskSelector, [taskId]);
  const user = useSelector(friendlyUsernameSelector, [to]);
  const {
    data: token,
    isFetching: isFetchingToken,
  } = useDataFetcher<TokenType>(tokenFetcher, [tokenAddress], [tokenAddress]);

  const { decimals, symbol } = token || {};

  // For MVP, rating is always 2 stars and rating never fails
  const rating = 2;
  const didFailToRate = false;

  const reputationEarned = useReputationEarned(
    taskReputation,
    rating,
    didFailToRate,
  );
  const { gasPrice, gasLimit } = useSelector(transactionByHash, [hash]);

  const transactionFee =
    gasPrice && gasLimit && gasPrice.mul(new BigNumber(gasLimit));
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
            <TimeRelative value={date} />
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
                  address: to,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptAmountText}
                values={{
                  amount: (
                    <Numeral
                      truncate={2}
                      unit={decimals}
                      value={getTaskPayoutAmountMinusTransactionFee(
                        amount,
                        transactionFee,
                      )}
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
                      truncate={2}
                      unit={decimals}
                      value={getTaskPayoutTransactionFee(
                        amount,
                        transactionFee,
                      )}
                    />
                  ),
                  symbol,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptReputationText}
                values={{
                  isNonNegative: reputationEarned >= 0,
                  reputationAmount: (
                    <FormattedNumber value={reputationEarned} />
                  ),
                }}
              />
              {hash && (
                <>
                  <br />
                  <TransactionLink
                    className={styles.receiptLink}
                    hash={hash}
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
