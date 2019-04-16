/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BN from 'bn.js';

import type { NetworkProps } from '~immutable';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { useDataFetcher } from '~utils/hooks';

import { networkFeeFetcher } from '../../fetchers';

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
    defaultMessage: 'There is a 2.5% fee to help run the Colony Network.',
  },
});

type Props = {|
  amount: BN | number,
  symbol: string,
|};

const displayName = 'ColonyFee';

const ColonyFee = ({ amount, symbol }: Props) => {
  const {
    isFetching: isFetchingNetworkFee,
    data: networkData,
    error: networkFeeError,
  } = useDataFetcher<NetworkProps>(networkFeeFetcher, [], []);

  // TODO return loader
  if (
    isFetchingNetworkFee ||
    !networkData ||
    !networkData.feeInverse ||
    networkFeeError
  )
    return null;

  const { feeInverse } = networkData;

  const feeAmount = new BN(amount).mul(new BN(feeInverse));

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
              <FormattedMessage {...MSG.helpText} />
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
