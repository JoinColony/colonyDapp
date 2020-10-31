import React, { useMemo, useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import Button from '~core/Button';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { Address } from '~types/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';

const MSG = defineMessages({
  totalBalance: {
    id: 'dashboard.ColonyTotalFunds.totalBalance',
    defaultMessage: 'Colony total balance',
  },
  manageFundsLink: {
    id: 'dashboard.ColonyTotalFunds.manageFundsLink',
    defaultMessage: 'Manage Funds',
  },
  loadingData: {
    id: 'dashboard.ColonyTotalFunds.loadingData',
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: 'dashboard.ColonyTotalFunds.tokenSelect',
    defaultMessage: 'Select Tokens',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyTotalFunds';

const ColonyTotalFunds = ({
  colony: { colonyAddress, tokens: colonyTokens, nativeTokenAddress },
}: Props) => {
  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>(
    nativeTokenAddress,
  );
  const handleManageFunds = useCallback(
    // eslint-disable-next-line no-console
    () => console.log('Clicked! This should open the UAC manage funds modal'),
    [],
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
      <div className={styles.main}>
        <SpinnerLoader appearance={{ size: 'small' }} />
        <span className={styles.loadingText}>
          <FormattedMessage {...MSG.loadingData} />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.selectedToken}>
        <Numeral
          className={styles.selectedTokenAmount}
          unit={getTokenDecimalsWithFallback(currentToken.decimals)}
          value={currentToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
        />
        <ColonyTotalFundsPopover
          tokens={data.tokens}
          onSelectToken={setCurrentTokenAddress}
          currentTokenAddress={currentTokenAddress}
        >
          <button className={styles.selectedTokenSymbol} type="button">
            {currentToken.symbol}
            <span className={styles.caretContainer}>
              <Icon
                className={styles.caretIcon}
                name="caret-down-small"
                title={MSG.tokenSelect}
              />
            </span>
          </button>
        </ColonyTotalFundsPopover>
      </div>
      <div className={styles.totalBalanceCopy}>
        <FormattedMessage {...MSG.totalBalance} />
        <Button
          appearance={{ theme: 'blue', size: 'small' }}
          onClick={handleManageFunds}
        >
          <span className={styles.rightArrowDisplay}>→</span>
          <FormattedMessage {...MSG.manageFundsLink} />
        </Button>
      </div>
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
