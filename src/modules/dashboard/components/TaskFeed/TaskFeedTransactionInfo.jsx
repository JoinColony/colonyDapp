/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';

import type { ContractTransactionType, UserType } from '~immutable';

import ExternalLink from '~core/ExternalLink';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import { useDataFetcher } from '~utils/hooks';

import { useToken } from '../../hooks';
import { userFetcher } from '../../../users/fetchers';

import styles from './TaskFeedTransactionInfo.css';

const MSG = defineMessages({
  eventTaskSentMessage: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.eventTaskSentMessage',
    defaultMessage: 'The task has been completed and payment sent to {user}',
  },
  receiptAmountText: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.receiptAmountText',
    defaultMessage: 'Amount: {amount} {symbol}',
  },
  receiptColonyFeeText: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.receiptColonyFeeText',
    defaultMessage: 'Colony fee: {amount} {symbol}',
  },
  receiptRecipientText: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.receiptRecipientText',
    defaultMessage: 'Recipient: {address}',
  },
  receiptReputationText: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.receiptReputationText',
    defaultMessage: `Reputation:
{isNonNegative, select, true {+} false {}}{reputationAmount} rep`,
  },
  receiptViewTxLinkText: {
    id: 'dashboard.TaskFeed.TaskFeedTransactionInfo.receiptViewTxLinkText',
    defaultMessage: 'View the task on Etherscan',
  },
});

type Props = {|
  reputation: number,
  transaction: ContractTransactionType,
|};

const displayName = 'dashboard.TaskFeed.TaskFeedTransactionInfo';

const TaskFeedTransactionInfo = ({
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

  if (!user || isFetching) return <SpinnerLoader />;

  return (
    <div className={styles.main}>
      <div className={styles.transactionSentCopy}>
        <p>
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
          <span className={styles.timeSinceTx}>
            <TimeRelative value={date} />
          </span>
        </p>
      </div>
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
              // @TODO use amount minus network fee
              values={{
                amount: <Numeral decimals={4} unit="ether" value={amount} />,
                symbol,
              }}
            />
            <br />
            <FormattedMessage
              {...MSG.receiptColonyFeeText}
              // @TODO use actual network fee
              values={{
                amount: <Numeral decimals={4} unit="ether" value={amount} />,
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
    </div>
  );
};

TaskFeedTransactionInfo.displayName = displayName;

export default TaskFeedTransactionInfo;
