/* @flow */

import type { List } from 'immutable';

import React from 'react';
import cx from 'classnames';

import type { TaskPayoutRecord } from '~types';

import { Tooltip } from '../Popover';
import Numeral from '../Numeral';

import styles from './PayoutsList.css';

type Props = {
  /* Payouts list containing all the payouts */
  payouts: List<TaskPayoutRecord>,
  /* Maximum lines to show before switching to popover */
  maxLines?: number,
  /* Native token of the displayed Colony */
  nativeToken: string,
};

const displayName = 'PayoutsList';

const PayoutsList = ({ payouts, maxLines = 1, nativeToken }: Props) => {
  /* TODO: there is probably a better way to sort this. We can do better! */
  const sortedPayouts = payouts.sort((a, b) => {
    if (a.symbol === nativeToken && b.symbol === 'ETH') {
      return -1;
    }
    if (b.symbol === nativeToken && a.symbol === 'ETH') {
      return 1;
    }
    if (a.symbol === nativeToken || a.symbol === 'ETH') {
      return -1;
    }
    return 1;
  });

  const firstPayouts = sortedPayouts.slice(0, maxLines);
  const extraPayouts = sortedPayouts.slice(maxLines);

  return (
    <div className={styles.main}>
      <div className={styles.payout}>
        {firstPayouts.map(payout => (
          <Numeral
            className={cx(styles.payoutNumber, {
              [styles.native]: payout.symbol === nativeToken,
            })}
            key={payout.symbol}
            value={payout.amount}
            unit="ether"
            decimals={1}
            prefix={`${payout.symbol} `}
          />
        ))}
      </div>
      {extraPayouts && extraPayouts.size ? (
        <Tooltip
          content={
            <div className={styles.popoverContent}>
              {extraPayouts.map(payout => (
                <Numeral
                  className={cx(styles.payoutNumber, {
                    [styles.native]: payout.symbol === nativeToken,
                  })}
                  key={payout.symbol}
                  value={payout.amount}
                  unit="ether"
                  decimals={1}
                  prefix={`${payout.symbol} `}
                />
              ))}
            </div>
          }
        >
          <span className={styles.payoutPopover}>
            +{extraPayouts.size} more
          </span>
        </Tooltip>
      ) : null}
    </div>
  );
};

PayoutsList.displayName = displayName;

export default PayoutsList;
