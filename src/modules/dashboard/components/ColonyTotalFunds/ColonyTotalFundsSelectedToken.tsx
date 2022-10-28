import React, { useMemo, useState, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { MiniSpinnerLoader } from '~core/Preloaders';
import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';
import IconTooltip from '~core/IconTooltip';

const MSG = defineMessages({
  loadingData: {
    id: 'dashboard.ColonyTotalFundsSelectedToken.loadingData',
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: 'dashboard.ColonyTotalFundsSelectedToken.tokenSelect',
    defaultMessage: 'Select Tokens',
  },
});

type Props = {
  colony: Colony;
  children?: React.ReactChild;
};

const displayName = 'dashboard.ColonyTotalFundsSelectedToken';

const ColonyTotalFundsSelectedToken = ({
  colony: {
    colonyAddress,
    tokens: colonyTokens,
    nativeTokenAddress,
    isNativeTokenLocked,
  },
  children,
}: Props) => {
  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>(
    nativeTokenAddress,
  );

  const {
    data,
    loading: isLoadingTokenBalances,
  } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      domainIds: [COLONY_TOTAL_BALANCE_DOMAIN_ID],
      tokenAddresses: colonyTokens.map(({ address }) => address),
    },
  });

  useEffect(() => {
    setCurrentTokenAddress(nativeTokenAddress);
  }, [nativeTokenAddress]);

  const currentToken = useMemo(() => {
    if (data && data.tokens) {
      return data.tokens.find(
        ({ address: tokenAddress }) => tokenAddress === currentTokenAddress,
      );
    }
    return undefined;
  }, [data, currentTokenAddress]);

  if (!data || !currentToken || isLoadingTokenBalances) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        loadingText={MSG.loadingData}
        titleTextValues={{ hasCounter: false }}
      />
    );
  }

  return (
    <div className={styles.selectedToken}>
      <Numeral
        className={styles.selectedTokenAmount}
        unit={getTokenDecimalsWithFallback(currentToken.decimals)}
        value={currentToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
        data-test="colonyTotalFunds"
      />
      <ColonyTotalFundsPopover
        tokens={data.tokens}
        onSelectToken={setCurrentTokenAddress}
        currentTokenAddress={currentTokenAddress}
      >
        <button className={styles.selectedTokenSymbol} type="button">
          <span data-test="colonyTokenSymbol">{currentToken.symbol}</span>
          {currentTokenAddress === nativeTokenAddress &&
            isNativeTokenLocked && (
              <IconTooltip
                icon="lock"
                tooltipText={{ id: 'tooltip.lockedToken' }}
                className={styles.tokenLockWrapper}
                appearance={{ size: 'large' }}
              />
            )}
          <Icon
            className={styles.caretIcon}
            name="caret-down-small"
            title={MSG.tokenSelect}
          />
        </button>
      </ColonyTotalFundsPopover>
      {children}
    </div>
  );
};

ColonyTotalFundsSelectedToken.displayName = displayName;

export default ColonyTotalFundsSelectedToken;
