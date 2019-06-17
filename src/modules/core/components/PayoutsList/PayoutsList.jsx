/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';

import type { TaskPayoutType, TokenReferenceType } from '~immutable';

import { tokenIsETH } from '../../checks';

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
  nativeToken: ?TokenReferenceType,
|};

const displayName = 'PayoutsList';

const PayoutsList = ({ payouts, maxLines = 1, nativeToken }: Props) => {
  const { address: nativeTokenAddress } = nativeToken || {};

  const sortedPayouts = payouts.sort(({ token: a }, { token: b }) => {
    if (a.address === nativeTokenAddress && tokenIsETH(b)) {
      return -1;
    }
    if (b.address === nativeTokenAddress && tokenIsETH(b)) {
      return 1;
    }
    if (a.address === nativeTokenAddress || tokenIsETH(b)) {
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
              [styles.native]: payout.token.address === nativeTokenAddress,
            })}
            key={payout.token.address}
            prefix={`${payout.token.symbol} `}
            truncate={2}
            unit={payout.token.decimals || 18}
            value={payout.amount}
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
                  key={payout.token.address}
                  value={payout.amount}
                  unit={payout.token.decimals || 18}
                  truncate={2}
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
