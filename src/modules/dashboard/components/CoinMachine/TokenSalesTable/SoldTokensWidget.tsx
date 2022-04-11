import { FormattedMessage, defineMessages } from 'react-intl';
import React from 'react';
import { bigNumberify } from 'ethers/utils';

import { AnyToken } from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';
import Numeral from '~core/Numeral';

import styles from './SoldTokensWidget.css';

const MSG = defineMessages({
  soldOut: {
    id: `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget.soldOut`,
    defaultMessage: 'SOLD OUT',
  },
  periodTokens: {
    id: `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget.periodTokens`,
    defaultMessage: '{tokensBought}/{tokensAvailable}',
  },
});

interface Props {
  tokensBought: string;
  tokensAvailable: string;
  maxPerPeriod: string;
  sellableToken: AnyToken;
}

const displayedName = `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget`;

const SoldTokensWidget = ({
  tokensBought,
  tokensAvailable,
  maxPerPeriod,
  sellableToken: { decimals = 18 },
}: Props) => {
  const totalAvailable = bigNumberify(tokensAvailable);
  const maximumPerPeriod = bigNumberify(maxPerPeriod);
  const lowestUpperLimit = totalAvailable.gt(maximumPerPeriod)
    ? maximumPerPeriod
    : totalAvailable;

  if (
    bigNumberify(tokensBought).gte(lowestUpperLimit) &&
    lowestUpperLimit.eq(maximumPerPeriod)
  ) {
    return (
      <span className={styles.soldOut}>
        <FormattedMessage {...MSG.soldOut} />
      </span>
    );
  }

  return (
    <FormattedMessage
      {...MSG.periodTokens}
      values={{
        tokensBought: (
          <Numeral
            value={getFormattedTokenValue(bigNumberify(tokensBought), decimals)}
          />
        ),
        tokensAvailable: (
          <Numeral value={getFormattedTokenValue(lowestUpperLimit, decimals)} />
        ),
      }}
    />
  );
};

SoldTokensWidget.displayName = displayedName;

export default SoldTokensWidget;
