/* @flow */

// $FlowFixMe until hooks flow types
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import BigNumber from 'bn.js';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';
import { useSelector } from '~utils/hooks';

import {
  networkFeeInverseSelector,
  networkFeeSelector,
} from '../../../../core/selectors';

import styles from './NetworkFee.css';

const MSG = defineMessages({
  errorText: {
    id: 'dashboard.Task.Payout.NetworkFee.errorText',
    defaultMessage: 'There was an error loading network information.',
  },
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

type Props = {|
  amount: BigNumber | number,
  decimals: number,
  symbol: string,
|};

const displayName = 'dashboard.Task.Payout.NetworkFee';

const NetworkFee = ({ amount, decimals, symbol }: Props) => {
  const networkFee = useSelector(networkFeeSelector);
  const networkFeeInverse = useSelector(networkFeeInverseSelector);
  const metaColonyFee = useMemo(
    () => {
      if (new BigNumber(amount).isZero() || networkFeeInverse === 1) {
        return amount;
      }
      return new BigNumber(amount)
        .div(new BigNumber(networkFeeInverse))
        .add(new BigNumber(1));
    },
    [amount, networkFeeInverse],
  );
  return (
    <>
      <div className={styles.amount}>
        <FormattedMessage
          {...MSG.colonyFeeText}
          values={{
            amount: (
              <Numeral
                suffix={` ${symbol}`}
                unit={decimals}
                value={metaColonyFee}
              />
            ),
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
                    <FormattedNumber style="percent" value={networkFee} />
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
