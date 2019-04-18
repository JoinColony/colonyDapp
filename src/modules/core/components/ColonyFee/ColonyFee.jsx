/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import BN from 'bn.js';

import type { NetworkProps } from '~immutable';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { useDataFetcher } from '~utils/hooks';

import { networkFetcher } from '../../fetchers';

import styles from './ColonyFee.css';

const MSG = defineMessages({
  colonyFeeText: {
    id: 'ColonyFee.colonyFeeText',
    defaultMessage: 'Colony Fee: {amount}',
  },
  helpIconTitle: {
    id: 'ColonyFee.helpIconTitle',
    defaultMessage: 'Help',
  },
  helpText: {
    id: 'ColonyFee.helpText',
    defaultMessage:
      'There is a {percentage} fee to help run the Colony Network.',
  },
});

const getFeePercentage = (feeInverse: BN): number => 1 / feeInverse;

const getNetworkFee = (amount: BN | number, feePercentage: number): number =>
  new BN(amount).toNumber() * feePercentage;

type Props = {|
  amount: BN | number,
  symbol: string,
|};

const displayName = 'ColonyFee';

const ColonyFee = ({ amount, symbol }: Props) => {
  const {
    isFetching: isFetchingNetwork,
    data: network,
    error: networkError,
  } = useDataFetcher<NetworkProps>(networkFetcher, [], []);

  // TODO return loader
  if (isFetchingNetwork || !network || !network.feeInverse || networkError)
    return null;

  const { feeInverse } = network;

  const feePercentage: number = getFeePercentage(feeInverse);
  const feeAmount: number = getNetworkFee(amount, feePercentage);

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
                    <FormattedNumber style="percent" value={feePercentage} />
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

ColonyFee.displayName = displayName;

export default ColonyFee;
