import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Payouts } from '~data/index';
import { Address } from '~types/index';
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

interface Props {
  /** Maximum lines to show before switching to popover */
  maxLines?: number;

  /** Payouts list containing all the payouts */
  payouts: Payouts;

  /** Pretty self-explanatory */
  nativeTokenAddress: Address;
}

const displayName = 'PayoutsList';

const PayoutsList = ({ maxLines = 1, nativeTokenAddress, payouts }: Props) => {
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
        {firstPayouts.map(({ amount, token }) => (
          <Numeral
            className={cx(styles.payoutNumber, {
              [styles.native]: token.address === nativeTokenAddress,
            })}
            key={token.address}
            suffix={` ${token.details.symbol} `}
            unit={DEFAULT_TOKEN_DECIMALS}
            value={
              new BigNumber(moveDecimal(amount, token.details.decimals || 18))
            }
          />
        ))}
      </div>
      {extraPayouts && extraPayouts.length ? (
        <Tooltip
          content={
            <div className={styles.popoverContent}>
              {extraPayouts.map(({ amount, token }) => (
                <Numeral
                  className={cx(styles.payoutNumber, {
                    [styles.native]: token.address === nativeTokenAddress,
                  })}
                  key={token.address}
                  value={
                    new BigNumber(
                      moveDecimal(amount, token.details.decimals || 18),
                    )
                  }
                  unit={DEFAULT_TOKEN_DECIMALS}
                  suffix={` ${token.details.symbol} `}
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
