import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

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

interface Props {
  amount: BigNumber | number | string;
  decimals: number;
  symbol: string;
}

const displayName = 'dashboard.Task.Payout.NetworkFee';

const NetworkFee = ({ amount, decimals, symbol }: Props) => {
  const networkFee = useSelector(networkFeeSelector);
  const networkFeeInverse = useSelector(networkFeeInverseSelector);
  const metaColonyFee = useMemo(() => {
    const amountBn = new BigNumber(moveDecimal(amount, decimals));
    if (amountBn.isZero() || networkFeeInverse === 1) {
      return amountBn;
    }
    return (
      new BigNumber(amountBn)
        .div(new BigNumber(networkFeeInverse))
        // Add 1 wei to network fee, because the contracts do too
        .add(new BigNumber(1))
    );
  }, [amount, decimals, networkFeeInverse]);
  return (
    <>
      <div>
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
                    <Numeral value={networkFee * 1e2} suffix="%" truncate={1} />
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
