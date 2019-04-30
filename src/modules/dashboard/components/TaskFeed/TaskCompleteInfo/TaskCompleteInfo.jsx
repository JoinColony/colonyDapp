/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';

import type { TokenType, UserType } from '~immutable';

import ExternalLink from '~core/ExternalLink';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import { getEtherscanTxUrl } from '~utils/external';
import { useDataFetcher, useSelector } from '~utils/hooks';

import type { EnhancedProps as Props } from './types';

import { networkFeeSelector } from '../../../../core/selectors';
import { tokenFetcher } from '../../../fetchers';
import { userFetcher } from '../../../../users/fetchers';

import styles from './TaskCompleteInfo.css';

const getTaskPayoutNetworkFee = (amount: number, fee: number) => amount * fee;

const getTaskPayoutAmountMinusNetworkFee = (amount: number, fee: number) =>
  amount - getTaskPayoutNetworkFee(amount, fee);

const MSG = defineMessages({
  eventTaskSentMessage: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.eventTaskSentMessage',
    defaultMessage: 'The task has been completed and payment sent to {user}',
  },
  receiptAmountText: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.receiptAmountText',
    defaultMessage: 'Amount: {amount} {symbol}',
  },
  receiptColonyFeeText: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.receiptColonyFeeText',
    defaultMessage: 'Colony fee: {amount} {symbol}',
  },
  receiptRecipientText: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.receiptRecipientText',
    defaultMessage: 'Recipient: {address}',
  },
  receiptReputationText: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.receiptReputationText',
    defaultMessage: `Reputation:
{isNonNegative, select, true {+} false {}}{reputationAmount} rep`,
  },
  receiptViewTxLinkText: {
    id: 'dashboard.TaskFeed.TaskCompleteInfo.receiptViewTxLinkText',
    defaultMessage: 'View the task on Etherscan',
  },
});

const displayName = 'dashboard.TaskFeed.TaskCompleteInfo';

const TaskCompleteInfo = ({
  reputation,
  transaction: { amount, date, hash, to, token: tokenAddress },
}: Props) => {
  const { data: user, isFetching: isFetchingUser } = useDataFetcher<UserType>(
    userFetcher,
    [to],
    [to],
  );
  const {
    data: token,
    isFetching: isFetchingToken,
  } = useDataFetcher<TokenType>(tokenFetcher, [tokenAddress], [tokenAddress]);

  const { symbol } = token || {};

  /**
   * @todo: Use fee data from the transaction
   * @body: The current network fee doesn't necessarily reflect the fee at time of tx.
   */
  const networkFee = useSelector(networkFeeSelector);

  return (
    <div className={styles.main}>
      <div className={styles.transactionSentCopy}>
        <p>
          {!user || isFetchingUser ? (
            <SpinnerLoader />
          ) : (
            <FormattedMessage
              {...MSG.eventTaskSentMessage}
              values={{
                user: (
                  <span className={styles.username}>
                    {user.profile.displayName || user.profile.username}
                  </span>
                ),
              }}
            />
          )}
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
                      decimals={4}
                      unit="ether"
                      value={getTaskPayoutAmountMinusNetworkFee(
                        amount,
                        networkFee,
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
                      decimals={4}
                      unit="ether"
                      value={getTaskPayoutNetworkFee(amount, networkFee)}
                    />
                  ),
                  symbol,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptReputationText}
                values={{
                  isNonNegative: reputation >= 0,
                  reputationAmount: <FormattedNumber value={reputation} />,
                }}
              />
              {hash && (
                <>
                  <br />
                  <ExternalLink
                    className={styles.receiptLink}
                    text={MSG.receiptViewTxLinkText}
                    href={getEtherscanTxUrl(hash)}
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

TaskCompleteInfo.displayName = displayName;

export default TaskCompleteInfo;
