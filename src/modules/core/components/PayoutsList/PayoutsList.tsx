import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import cx from 'classnames';

import {
  TaskPayoutType,
  ColonyTokenReferenceType,
  TokenType,
} from '~immutable/index';
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

  /** Native token of the displayed Colony */
  nativeToken?: ColonyTokenReferenceType;

  /** Payouts list containing all the payouts */
  payouts: TaskPayoutType[];

  /** Tokens available to the current colony */
  tokenOptions: TokenType[];
}

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

  const { address: nativeTokenAddress = undefined } = nativeToken || {};

  const sortedPayouts = payouts.sort(
    ({ token: firstToken }, { token: secondToken }) => {
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
          const token = getToken(payout.token);
          return token ? (
            <Numeral
              className={cx(styles.payoutNumber, {
                [styles.native]: payout.token === nativeTokenAddress,
              })}
              key={payout.token}
              suffix={` ${token.symbol} `}
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
                    suffix={` ${token.symbol} `}
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
