import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import CopyableAddress from '~core/CopyableAddress';
import TokenLink from '~core/TokenLink';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';

import styles from './InfoPopover.css';

const MSG = defineMessages({
  nativeTokenMessage: {
    id: 'InfoPopover.nativeTokenMessage',
    defaultMessage: "*This is the colony's native token",
  },
  viewOnEtherscan: {
    id: 'InfoPopover.viewOnEtherscan',
    defaultMessage: 'View on Etherscan',
  },
});

interface Props {
  token: AnyToken;
  isTokenNative: boolean;
}

const displayName = 'core.InfoPopover.TokenInfoPopover';

const TokenInfoPopover = ({ token, isTokenNative }: Props) => {
  const { name, symbol, address } = token;
  return (
    <div className={styles.main}>
      {name && (
        <div title={name} className={styles.displayName}>
          <TokenIcon token={token} name={token.name || undefined} size="xxs" />
          {name}
        </div>
      )}
      {symbol && (
        <p title={symbol} className={styles.symbol}>
          {symbol}
        </p>
      )}
      <div title={address} className={styles.address}>
        <CopyableAddress full>{address}</CopyableAddress>
      </div>
      {isTokenNative && (
        <p className={styles.nativeTokenMessage}>
          <FormattedMessage {...MSG.nativeTokenMessage} />
        </p>
      )}
      <div className={styles.etherscanDivider}>
        <TokenLink tokenAddress={address} text={MSG.viewOnEtherscan} />
      </div>
    </div>
  );
};

TokenInfoPopover.displayName = displayName;

export default TokenInfoPopover;
