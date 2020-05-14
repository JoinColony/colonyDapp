import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';
import { bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import moveDecimal from 'move-decimal-point';
import InfoPopover from '~core/InfoPopover';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { Payouts } from '~data/index';
import { Address } from '~types/index';

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
  clickDisabled?: boolean;

  /** Maximum lines to show before switching to popover */
  maxLines?: number;

  /** Payouts list containing all the payouts */
  payouts: Payouts;

  /** Pretty self-explanatory */
  nativeTokenAddress: Address;
}

const displayName = 'PayoutsList';

const PayoutsList = ({
  clickDisabled,
  maxLines = 1,
  nativeTokenAddress,
  payouts,
}: Props) => {
  const sortedPayouts = payouts.sort(
    (
      { token: { address: firstToken } },
      { token: { address: secondToken } },
    ) => {
      if (firstToken === nativeTokenAddress && secondToken === AddressZero) {
        return -1;
      }
      if (secondToken === nativeTokenAddress && secondToken === AddressZero) {
        return 1;
      }
      if (firstToken === nativeTokenAddress || secondToken === AddressZero) {
        return -1;
      }
      return 1;
    },
  );

  const firstPayouts = sortedPayouts.slice(0, maxLines);
  const extraPayouts = sortedPayouts.slice(maxLines);

  return (
    <div aria-disabled={clickDisabled} className={styles.main}>
      <div>
        {firstPayouts.map(({ amount, token }) => (
          <div key={token.address} className={styles.tokenInfo}>
            <InfoPopover
              token={token}
              isTokenNative={token.address === nativeTokenAddress}
            >
              <div className={styles.tokenPayout}>
                <Numeral
                  className={cx(styles.payoutNumber, {
                    [styles.native]: token.address === nativeTokenAddress,
                  })}
                  suffix={` ${token.symbol} `}
                  unit={getTokenDecimalsWithFallback(token.decimals)}
                  value={bigNumberify(
                    moveDecimal(
                      amount,
                      getTokenDecimalsWithFallback(token.decimals),
                    ),
                  )}
                />
              </div>
            </InfoPopover>
          </div>
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
                  value={bigNumberify(
                    moveDecimal(
                      amount,
                      getTokenDecimalsWithFallback(token.decimals),
                    ),
                  )}
                  unit={getTokenDecimalsWithFallback(token.decimals)}
                  suffix={` ${token.symbol} `}
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
