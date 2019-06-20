/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';

import type { TaskPayoutType, TokenReferenceType, TokenType } from '~immutable';
import type { Address } from '~types';

import { ZERO_ADDRESS } from '~utils/web3/constants';

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
  /** Maximum lines to show before switching to popover */
  maxLines?: number,
  /** Native token of the displayed Colony */
  nativeToken: ?TokenReferenceType,
  /** Payouts list containing all the payouts */
  payouts: Array<TaskPayoutType>,
  /** Tokens available to the current colony */
  tokenOptions: Array<TokenType>,
|};

const displayName = 'PayoutsList';

const PayoutsList = ({
  maxLines = 1,
  nativeToken,
  payouts,
  tokenOptions,
}: Props) => {
  const getToken = useCallback(
    (tokenAddress: Address) =>
      tokenOptions.find(({ address }) => address === tokenAddress),
    [tokenOptions],
  );

  const { address: nativeTokenAddress } = nativeToken || {};

  const sortedPayouts = payouts.sort(({ token: a }, { token: b }) => {
    if (a === nativeTokenAddress && b === ZERO_ADDRESS) {
      return -1;
    }
    if (b === nativeTokenAddress && b === ZERO_ADDRESS) {
      return 1;
    }
    if (a === nativeTokenAddress || b === ZERO_ADDRESS) {
      return -1;
    }
    return 1;
  });

  const firstPayouts = sortedPayouts.slice(0, maxLines);
  const extraPayouts = sortedPayouts.slice(maxLines);

  return (
    <div className={styles.main}>
      <div className={styles.payout}>
        {firstPayouts.map(payout => {
          const token = getToken(payout.token);
          return token ? (
            <Numeral
              className={cx(styles.payoutNumber, {
                [styles.native]: payout.token === nativeTokenAddress,
              })}
              key={payout.token}
              prefix={`${token.symbol} `}
              truncate={2}
              unit={token.decimals || 18}
              value={payout.amount}
            />
          ) : null;
        })}
      </div>
      {extraPayouts && extraPayouts.length ? (
        <Tooltip
          content={
            <div className={styles.popoverContent}>
              {extraPayouts.map(payout => {
                const token = getToken(payout.token);
                return token ? (
                  <Numeral
                    className={cx(styles.payoutNumber, {
                      [styles.native]: payout.token === nativeTokenAddress,
                    })}
                    key={payout.token}
                    value={payout.amount}
                    unit={token.decimals || 18}
                    truncate={2}
                    prefix={`${token.symbol} `}
                  />
                ) : null;
              })}
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
