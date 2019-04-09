/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';

import type { UserType } from '~immutable';

import ExternalLink from '~core/ExternalLink';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import { useDataFetcher } from '~utils/hooks';

import type { EnhancedProps as Props } from './types';

import { useToken } from '../../../hooks';
import { userFetcher } from '../../../../users/fetchers';

import styles from './TaskCompleteInfo.css';

const NETWORK_FEE = 0.01;

const getTaskPayoutNetworkFee = (amount: number) => amount * NETWORK_FEE;

const getTaskPayoutAmountMinusNetworkFee = (amount: number) =>
  amount - getTaskPayoutNetworkFee(amount);

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
  const { data: user, isFetching } = useDataFetcher<UserType>(
    userFetcher,
    [to],
    [to],
  );
  const token = useToken(tokenAddress);
  const { symbol } = token || {};

  return (
    <div className={styles.main}>
      <div className={styles.transactionSentCopy}>
        <p>
          {!user || isFetching ? (
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
      {!token ? (
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
                      value={getTaskPayoutAmountMinusNetworkFee(amount)}
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
                      value={getTaskPayoutNetworkFee(amount)}
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
                    href={`https://rinkeby.etherscan.io/tx/${hash}`}
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
