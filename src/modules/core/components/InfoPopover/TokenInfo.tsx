import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { addToken } from '@purser/metamask/lib-esm/helpers';
import { AddressZero } from 'ethers/constants';

import CopyableAddress from '~core/CopyableAddress';
import TokenLink from '~core/TokenLink';
import Button from '~core/Button';

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
  addToWallet: {
    id: 'InfoPopover.TokenInfoPopover.TokenInfo.addToWallet',
    defaultMessage: 'Add token to Metamask',
  },
});

interface Props {
  token: AnyToken;
  isTokenNative: boolean;
}

const displayName = 'InfoPopover.TokenInfoPopover.TokenInfo';

const TokenInfo = ({ token, isTokenNative }: Props) => {
  const { name, symbol, address, decimals } = token;

  const handleAddAssetToMetamask = useCallback(
    () =>
      addToken({
        address,
        symbol,
        decimals,
      }),
    [address, symbol, decimals],
  );

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
          className={styles.etherscanLink}
          tokenAddress={address}
          text={MSG.viewOnEtherscan}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
        {address !== AddressZero && (
          <span className={styles.addToWallet}>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.addToWallet}
              onClick={handleAddAssetToMetamask}
            />
          </span>
        )}
      </div>
    </div>
  );
};

TokenInfo.displayName = displayName;

export default TokenInfo;
