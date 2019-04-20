/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';

import type { TaskPayoutType } from '~immutable';

import { Tooltip } from '../Popover';
import Numeral from '../Numeral';

import styles from './PayoutsList.css';

const MSG = defineMessages({
  extraPayoutsText: {
    id: 'PayoutsList.extraPayoutsText',
    defaultMessage: '+{extraPayouts} more',
  },
});

type Props = {|
  /** Payouts list containing all the payouts */
  payouts: Array<TaskPayoutType>,
  /** Maximum lines to show before switching to popover */
  maxLines?: number,
  /** Native token of the displayed Colony */
  nativeToken: string,
|};

const displayName = 'PayoutsList';

const PayoutsList = ({ payouts, maxLines = 1, nativeToken }: Props) => {
  /* TODO: there is probably a better way to sort this. We can do better! */
  const sortedPayouts = payouts.sort(({ token: a }, { token: b }) => {
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
              [styles.native]: payout.token.symbol === nativeToken,
            })}
            key={payout.token.symbol}
            value={payout.amount}
            unit="ether"
            decimals={1}
            prefix={`${payout.token.symbol} `}
          />
        ))}
      </div>
      {extraPayouts && extraPayouts.length ? (
        <Tooltip
          content={
            <div className={styles.popoverContent}>
              {extraPayouts.map(payout => (
                <Numeral
                  className={cx(styles.payoutNumber, {
                    [styles.native]: payout.token.symbol === nativeToken,
                  })}
                  key={payout.token.symbol}
                  value={payout.amount}
                  unit="ether"
                  decimals={1}
                  prefix={`${payout.token.symbol} `}
                />
              ))}
            </div>
          }
        >
          <span className={styles.payoutPopover}>
            <FormattedMessage
              {...MSG.extraPayoutsText}
              values={{
                extraPayouts: <FormattedNumber value={extraPayouts.length} />,
              }}
            />
          </span>
        </Tooltip>
      ) : null}
    </div>
  );
};

PayoutsList.displayName = displayName;

export default PayoutsList;
