import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import TimeRelative from '~core/TimeRelative';
import TransactionLink from '~core/TransactionLink';
import { useUser, useTokenQuery, useColonyQuery, AnyTask } from '~data/index';
import InfoPopover from '~core/InfoPopover';
import { createAddress } from '~utils/web3';

import { Address } from '~types/index';

import { getFriendlyName } from '../../../users/transformers';

import styles from './TaskFeedCompleteInfo.css';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

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
    defaultMessage: 'View the transaction on Etherscan',
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
  colonyAddress: Address;
  skillId?: number;
}

const displayName = 'dashboard.TaskFeed.TaskFeedCompleteInfo';

const TaskFeedCompleteInfo = ({
  finalizedAt,
  finalizedPayment: { amount, tokenAddress, workerAddress, transactionHash },
  payouts,
  colonyAddress,
  skillId,
}: Props) => {
  const user = useUser(workerAddress);
  const payout = payouts.find(
    /*
     * @NOTE Checksumming the address is added for legacy reasons as thery "might"
     * exist some values in the databased that are not checksummed at all, meaning that
     * this will fail for those cases (payment will always be 0)
     */
    ({ token: { address } }) =>
      createAddress(address) === createAddress(tokenAddress),
  );
  const fullPayoutAmount = (payout && payout.amount) || 0;
  const { data: tokenData, loading: isLoadingToken } = useTokenQuery({
    variables: { address: tokenAddress },
  });
  const { data: colonyData, loading: isLoadingColony } = useColonyQuery({
    variables: { address: colonyAddress },
  });
  const { decimals = DEFAULT_TOKEN_DECIMALS, symbol = '', address = '' } =
    (tokenData && tokenData.token) || {};
  const { nativeTokenAddress = '' } = (colonyData && colonyData.colony) || {};
  const metaColonyFee = new BigNumber(
    moveDecimal(fullPayoutAmount, decimals),
  ).sub(new BigNumber(amount));

  return (
    <div>
      <div className={styles.transactionSentCopy}>
        <FormattedMessage
          {...MSG.eventTaskSentMessage}
          values={{
            user: (
              <InfoPopover
                colonyAddress={colonyAddress}
                skillId={skillId}
                user={user}
              >
                <span className={styles.username}>{getFriendlyName(user)}</span>
              </InfoPopover>
            ),
          }}
        />
        <span className={styles.timeSinceTx}>
          <TimeRelative value={new Date(finalizedAt)} />
        </span>
      </div>
      {isLoadingToken || isLoadingColony || !tokenData ? (
        <SpinnerLoader />
      ) : (
        <div className={styles.receiptContainer}>
          <div className={styles.receiptSideBorder} />
          <div className={styles.receiptTextBlock}>
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
                  <InfoPopover
                    token={tokenData.token}
                    isTokenNative={address === nativeTokenAddress}
                  >
                    <span className={styles.tokenInfo}>
                      <Numeral
                        integerSeparator=""
                        unit={decimals || DEFAULT_TOKEN_DECIMALS}
                        value={amount}
                      />
                    </span>
                  </InfoPopover>
                ),
                symbol,
              }}
            />
            <br />
            <FormattedMessage
              {...MSG.receiptColonyFeeText}
              values={{
                amount: (
                  <InfoPopover
                    token={tokenData.token}
                    isTokenNative={address === nativeTokenAddress}
                  >
                    <span className={styles.tokenInfo}>
                      <Numeral
                        unit={decimals || DEFAULT_TOKEN_DECIMALS}
                        value={metaColonyFee}
                      />
                    </span>
                  </InfoPopover>
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
          </div>
        </div>
      )}
    </div>
  );
};

TaskFeedCompleteInfo.displayName = displayName;

export default TaskFeedCompleteInfo;
