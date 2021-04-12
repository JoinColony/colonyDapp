import React, { useMemo, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import Icon from '~core/Icon';
import Link from '~core/Link';
import Numeral from '~core/Numeral';
import { MiniSpinnerLoader } from '~core/Preloaders';
import {
  Colony,
  useTokenBalancesForDomainsQuery,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ALLOWED_NETWORKS } from '~constants';

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
  colony: {
    colonyAddress,
    colonyName,
    tokens: colonyTokens,
    nativeTokenAddress,
    version,
  },
}: Props) => {
  const { networkId } = useLoggedInUser();

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

  const isSupportedColonyVersion =
    parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];

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
        {isSupportedColonyVersion && isNetworkAllowed && (
          <Link
            className={styles.manageFundsLink}
            to={`/colony/${colonyName}/funds`}
          >
            <span className={styles.rightArrowDisplay}>→</span>
            <FormattedMessage {...MSG.manageFundsLink} />
          </Link>
        )}
      </div>
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
