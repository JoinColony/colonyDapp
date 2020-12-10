import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import CopyableAddress from '~core/CopyableAddress';
import TokenLink from '~core/TokenLink';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';
import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './InfoPopover.css';

const MSG = defineMessages({
  nativeTokenMessage: {
    id: 'InfoPopover.TokenInfoPopover.TokenInfo.nativeTokenMessage',
    defaultMessage: "*This is the colony's native token",
  },
  viewOnEtherscan: {
    id: 'InfoPopover.TokenInfoPopover.TokenInfo.viewOnEtherscan',
    defaultMessage: 'View on {blockExplorerName}',
  },
});

interface Props {
  token: AnyToken;
  isTokenNative: boolean;
}

const displayName = 'InfoPopover.TokenInfoPopover.TokenInfo';

const TokenInfo = ({ token, isTokenNative }: Props) => {
  const { name, symbol, address } = token;
  return (
    <div className={styles.main}>
      <div className={styles.section}>
        {name && (
          <div title={name} className={styles.displayName}>
            <TokenIcon
              token={token}
              name={token.name || undefined}
              size="xxs"
            />
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
      </div>
      <div className={styles.section}>
        <TokenLink
          tokenAddress={address}
          text={MSG.viewOnEtherscan}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
      </div>
    </div>
  );
};

TokenInfo.displayName = displayName;

export default TokenInfo;
