import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Address } from '~types/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { ColonyTokens, Payouts } from '~data/index';

import { Tooltip } from '../Popover';
import Numeral from '../Numeral';
import styles from './PayoutsList.css';

const MSG = defineMessages({
  extraPayoutsText: {
    id: 'PayoutsList.extraPayoutsText',
    defaultMessage: '+{extraPayouts} more',
  },
});

interface Props {
  /** Maximum lines to show before switching to popover */
  maxLines?: number;

  /** Payouts list containing all the payouts */
  payouts: Payouts;

  /** Pretty self-explanatory */
  nativeTokenAddress: Address;

  /** Tokens available to the current colony */
  tokens: ColonyTokens;
}

const displayName = 'PayoutsList';

const PayoutsList = ({
  maxLines = 1,
  nativeTokenAddress,
  payouts,
  tokens,
}: Props) => {
  const getToken = useCallback(
    (tokenAddress: Address) =>
      tokens.find(({ address }) => address === tokenAddress),
    [tokens],
  );

  const sortedPayouts = payouts.sort(
    (
      { token: { address: firstToken } },
      { token: { address: secondToken } },
    ) => {
      if (firstToken === nativeTokenAddress && secondToken === ZERO_ADDRESS) {
        return -1;
      }
      if (secondToken === nativeTokenAddress && secondToken === ZERO_ADDRESS) {
        return 1;
      }
      if (firstToken === nativeTokenAddress || secondToken === ZERO_ADDRESS) {
        return -1;
      }
      return 1;
    },
  );

  const firstPayouts = sortedPayouts.slice(0, maxLines);
  const extraPayouts = sortedPayouts.slice(maxLines);

  return (
    <div className={styles.main}>
      <div>
        {firstPayouts.map(payout => {
          const token = getToken(payout.token.address);
          return token ? (
            <Numeral
              className={cx(styles.payoutNumber, {
                [styles.native]: payout.token.address === nativeTokenAddress,
              })}
              key={payout.token.address}
              suffix={` ${token.details.symbol} `}
              unit={DEFAULT_TOKEN_DECIMALS}
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
                const token = getToken(payout.token.address);
                return token ? (
                  <Numeral
                    className={cx(styles.payoutNumber, {
                      [styles.native]:
                        payout.token.address === nativeTokenAddress,
                    })}
                    key={payout.token.address}
                    value={payout.amount}
                    unit={DEFAULT_TOKEN_DECIMALS}
                    suffix={` ${token.details.symbol} `}
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
