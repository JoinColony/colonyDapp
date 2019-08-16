import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import { EventTypes } from '~data/constants';
import { Event } from '~data/types';
import { TokenType } from '~immutable/index';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { tokenFetcher } from '../../fetchers';
import { friendlyUsernameSelector } from '../../../users/selectors';
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
  event: Event<EventTypes.TASK_FINALIZED>;
}

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  createdAt,
  event: {
    payload: {
      amountPaid,
      paymentTokenAddress,
      workerAddress,
      transactionHash,
    },
  },
}: Props) => {
  const user = useSelector(friendlyUsernameSelector, [workerAddress]);
  const networkFeeInverse = useSelector(networkFeeInverseSelector);
  const { data: token, isFetching: isFetchingToken } = useDataFetcher<
    TokenType
  >(tokenFetcher, [paymentTokenAddress], [paymentTokenAddress]);
  const { decimals = 18, symbol = undefined } = token || {};
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
                      unit={decimals}
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
                  amount: <Numeral unit={decimals} value={metaColonyFee} />,
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
