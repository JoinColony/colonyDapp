import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';
import { useUser, useTokenQuery, AnyTask } from '~data/index';

import { getFriendlyName } from '../../../users/transformers';

import styles from './TaskFeedCompleteInfo.css';

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
  tokenAddressText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.tokenAddressText',
    defaultMessage: 'Token Address: {tokenAddress}',
  },
  receiptViewTxLinkText: {
    id: 'dashboard.TaskFeed.TaskFeedCompleteInfo.receiptViewTxLinkText',
    defaultMessage: 'View the task on Etherscan',
  },
});

interface Props {
  finalizedAt: string;
  finalizedPayment: {
    amount: string;
    tokenAddress: string;
    workerAddress: string;
    transactionHash: string;
  };
  payouts: AnyTask['payouts'];
}

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  finalizedAt,
  finalizedPayment: { amount, tokenAddress, workerAddress, transactionHash },
  payouts,
}: Props) => {
  const user = useUser(workerAddress);
  const payout = payouts.find(
    ({ token: { address } }) => address === tokenAddress,
  );
  const fullPayoutAmount = (payout && payout.amount) || 0;
  const { data, loading: isLoadingToken } = useTokenQuery({
    variables: { address: tokenAddress },
  });
  const { decimals = 18, symbol = '' } = (data && data.token) || {};
  const metaColonyFee = new BigNumber(
    moveDecimal(fullPayoutAmount, decimals),
  ).sub(new BigNumber(amount));

  return (
    <div>
      <div className={styles.transactionSentCopy}>
        <p>
          <FormattedMessage
            {...MSG.eventTaskSentMessage}
            values={{
              user: (
                <span className={styles.username}>{getFriendlyName(user)}</span>
              ),
            }}
          />
          <span className={styles.timeSinceTx}>
            <TimeRelative value={new Date(finalizedAt)} />
          </span>
        </p>
      </div>
      {isLoadingToken ? (
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
                {...MSG.tokenAddressText}
                values={{ tokenAddress }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptAmountText}
                values={{
                  amount: (
                    <Numeral
                      integerSeparator=""
                      unit={decimals || 18}
                      value={amount}
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
                    <Numeral unit={decimals || 18} value={metaColonyFee} />
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
