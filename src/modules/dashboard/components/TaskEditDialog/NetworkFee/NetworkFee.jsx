/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import BN from 'bn.js';

import type { NetworkProps } from '~immutable';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { useDataFetcher } from '~utils/hooks';

import { networkFetcher } from '../../../../core/fetchers';

import styles from './NetworkFee.css';

const MSG = defineMessages({
  colonyFeeText: {
    id: 'dashboard.Task.Payout.NetworkFee.colonyFeeText',
    defaultMessage: 'Colony Fee: {amount}',
  },
  helpIconTitle: {
    id: 'dashboard.Task.Payout.NetworkFee.helpIconTitle',
    defaultMessage: 'Help',
  },
  helpText: {
    id: 'dashboard.Task.Payout.NetworkFee.helpText',
    defaultMessage:
      'There is a {percentage} fee to help run the Colony Network.',
  },
});

const getNetworkFee = (amount: BN | number, feePercentage: number): number =>
  new BN(amount).toNumber() * feePercentage;

type Props = {|
  amount: BN | number,
  symbol: string,
|};

const displayName = 'dashboard.Task.Payout.NetworkFee';

const NetworkFee = ({ amount, symbol }: Props) => {
  const {
    isFetching: isFetchingNetwork,
    data: network,
    error: networkError,
  } = useDataFetcher<NetworkProps>(networkFetcher, [], []);

  // TODO return loader
  if (isFetchingNetwork || !network || !network.fee || networkError)
    return null;

  const { fee } = network;
  const feeAmount: number = getNetworkFee(amount, fee);

  return (
    <>
      <div className={styles.amount}>
        <FormattedMessage
          {...MSG.colonyFeeText}
          values={{
            amount: <Numeral value={feeAmount} suffix={` ${symbol}`} />,
          }}
        />
      </div>
      <div className={styles.help}>
        <Tooltip
          content={
            <div className={styles.tooltipText}>
              <FormattedMessage
                {...MSG.helpText}
                values={{
                  percentage: (
                    // eslint-disable-next-line react/style-prop-object
                    <FormattedNumber style="percent" value={fee} />
                  ),
                }}
              />
            </div>
          }
        >
          <button className={styles.helpButton} type="button">
            <Icon
              appearance={{ size: 'small', theme: 'invert' }}
              name="question-mark"
              title={MSG.helpIconTitle}
            />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

NetworkFee.displayName = displayName;

export default NetworkFee;
