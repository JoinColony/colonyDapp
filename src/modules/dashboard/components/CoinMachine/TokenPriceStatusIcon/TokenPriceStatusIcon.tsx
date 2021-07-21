import React from 'react';
import classnames from 'classnames';

import styles from './TokenPriceStatusIcon.css';

export enum TokenPriceStatuses {
  PRICE_UP = 'PRICE_UP',
  PRICE_DOWN = 'PRICE_DOWN',
  PRICE_NO_CHANGES = 'PRICE_NO_CHANGES',
  PRICE_SOLD_OUT = 'PRICE_SOLD_OUT',
}

interface Props {
  status: TokenPriceStatuses;
}

const displayName = 'dashboard.CoinMachine.TokenPriceStatusIcon';

const TokenPriceStatusIcon = ({
  status = TokenPriceStatuses.PRICE_UP,
}: Props) => {
  return (
    <div
      className={classnames({
        [styles.primaryUpArrow]: status === TokenPriceStatuses.PRICE_UP,
        [styles.greyDownArrow]: status === TokenPriceStatuses.PRICE_DOWN,
        [styles.primarySquare]: status === TokenPriceStatuses.PRICE_NO_CHANGES,
      })}
    >
      {status === TokenPriceStatuses.PRICE_SOLD_OUT && '🚀'}
    </div>
  );
};

TokenPriceStatusIcon.displayName = displayName;

export default TokenPriceStatusIcon;
