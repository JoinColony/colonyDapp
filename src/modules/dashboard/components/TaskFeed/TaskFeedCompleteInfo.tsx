import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';
import { useSelector } from '~utils/hooks';
import { useUser, useTokenQuery, FinalizeTaskEvent } from '~data/index';

import { getFriendlyName } from '../../../users/transformers';
import { networkFeeInverseSelector } from '../../../core/selectors';

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
  createdAt: Date;
  event: FinalizeTaskEvent;
}

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  createdAt,
  event: {
    // FIXME this has to be sorted out somehow
    // @ts-ignore
    payload: {
      amountPaid,
      paymentTokenAddress,
      workerAddress,
      transactionHash,
    },
  },
}: Props) => {
  const user = useUser(workerAddress);
  const networkFeeInverse = useSelector(networkFeeInverseSelector);
  const { data, loading: isLoadingToken } = useTokenQuery({
    variables: { address: paymentTokenAddress },
  });
  const { decimals = 18, symbol = '' } = (data && data.token.details) || {};
  const metaColonyFee = useMemo(() => {
    if (new BigNumber(amountPaid).isZero() || networkFeeInverse === 1) {
      return amountPaid;
    }
    return new BigNumber(amountPaid)
      .div(new BigNumber(networkFeeInverse))
      .add(new BigNumber(1));
  }, [amountPaid, networkFeeInverse]);
  const workerPayout = useMemo(
    () => new BigNumber(amountPaid).sub(metaColonyFee as BigNumber),
    [amountPaid, metaColonyFee],
  );

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
            <TimeRelative value={createdAt} />
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
                values={{
                  tokenAddress: paymentTokenAddress,
                }}
              />
              <br />
              <FormattedMessage
                {...MSG.receiptAmountText}
                values={{
                  amount: (
                    <Numeral
                      integerSeparator=""
                      unit={decimals || 18}
                      value={workerPayout}
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
