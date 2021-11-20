import { FormattedMessage, defineMessages } from 'react-intl';
import React from 'react';
import { bigNumberify } from 'ethers/utils';

import { AnyToken } from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';

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
  sellableToken: AnyToken;
}

const displayedName = `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget`;

const SoldTokensWidget = ({
  tokensBought,
  tokensAvailable,
  sellableToken: { decimals = 18 },
}: Props) => {
  if (bigNumberify(tokensBought).gte(tokensAvailable)) {
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
        tokensBought: getFormattedTokenValue(
          bigNumberify(tokensBought),
          decimals,
        ),
        tokensAvailable: getFormattedTokenValue(
          bigNumberify(tokensAvailable),
          decimals,
        ),
      }}
    />
  );
};

SoldTokensWidget.displayName = displayedName;

export default SoldTokensWidget;
