import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages } from 'react-intl';

import { SelectHorizontal } from '~core/Fields';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Token } from '~data/generated';

import styles from './ExpenditureSettings.css';

const displayName = `dashboard.ExpenditurePage.ExpenditureSettings.BalanceSelect`;

const MSG = defineMessages({
  balance: {
    id: `dashboard.ExpenditurePage.ExpenditureSettings.BalanceSelect.balance`,
    defaultMessage: 'Balance',
  },
});

interface Props {
  activeToken: Token;
  tokens: Token[];
  name: string;
  isLocked?: boolean;
}

const BalanceSelect = ({ activeToken, tokens, name, isLocked }: Props) => {
  const balanceOptions = useMemo(
    () =>
      tokens.map((token, index) => ({
        label: token.name,
        value: token.id,
        children: (
          <div
            className={classNames(styles.label, styles.option, {
              [styles.firstOption]: index === 0,
              [styles.weightBold]: isLocked,
            })}
          >
            <span className={styles.icon}>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token.name || token.address}
              />
            </span>

            <Numeral
              unit={getTokenDecimalsWithFallback(token.decimals)}
              value={token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
            />
            <span className={styles.symbol}>{token.symbol}</span>
          </div>
        ),
      })),
    [isLocked, tokens],
  );

  const renderBalanceActiveOption = useCallback(
    () => (
      <div
        className={classNames(styles.label, {
          [styles.weightBold]: isLocked,
        })}
      >
        <span className={styles.icon}>
          <TokenIcon
            className={styles.tokenIcon}
            token={activeToken}
            name={activeToken.name || activeToken.address}
          />
        </span>

        <Numeral
          unit={getTokenDecimalsWithFallback(activeToken.decimals)}
          value={activeToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
        />
        <span className={styles.symbol}>{activeToken.symbol}</span>
      </div>
    ),
    [activeToken, isLocked],
  );

  return (
    <div className={styles.balance}>
      <SelectHorizontal
        name={name}
        label={MSG.balance}
        appearance={{
          theme: 'alt',
        }}
        options={balanceOptions}
        renderActiveOption={renderBalanceActiveOption}
        unselectable
      />
    </div>
  );
};

BalanceSelect.displayName = displayName;

export default BalanceSelect;
