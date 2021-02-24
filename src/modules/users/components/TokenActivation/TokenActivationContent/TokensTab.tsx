import React, { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import Button from '~core/Button';
import Icon from '~core/Icon';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';

import { UserToken } from '~data/generated';
import { formatTokenValue } from '~utils/numbers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TokenActivationContent.css';
import TokensTabForm from './TokensTabForm';

const MSG = defineMessages({
  active: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.active',
    defaultMessage: 'Active',
  },
  inactive: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.inactive',
    defaultMessage: 'Inactive',
  },
  changeState: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.changeState',
    defaultMessage: 'Change token state',
  },
  activate: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.activate',
    defaultMessage: 'Activate',
  },
  withdraw: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.withdraw',
    defaultMessage: 'Withdraw',
  },
});

export interface TokensTabProps {
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  totalTokens: BigNumber;
  lockedTokens: BigNumber;
  token: UserToken;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  totalTokens,
  lockedTokens,
  token,
}: TokensTabProps) => {
  const [isActivate, setIsActivate] = useState(true);

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(token?.decimals),
    [token],
  );

  const formattedTotalAmount = formatTokenValue({
    value: totalTokens,
    suffix: ` ${token?.symbol}`,
    unit: tokenDecimals,
    truncate: 3,
  }).split(' ')[0];

  return (
    <>
      <div className={styles.totalTokensContainer}>
        <TokenIcon token={token || {}} size="xs" />
        <p className={styles.totalTokens}>
          {formattedTotalAmount} <span>{token?.symbol}</span>
        </p>
      </div>
      <div className={styles.tokensDetailsContainer}>
        <ul>
          <li>
            <div className={styles.listItem}>
              <div className={styles.greenDisc} />
              <p className={styles.listItemTitle}>
                <FormattedMessage {...MSG.active} />
              </p>
            </div>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={activeTokens}
                suffix={` ${token?.symbol}`}
                unit={tokenDecimals}
                truncate={3}
              />
            </div>
            <div className={styles.lockedAmountContainer}>
              <Icon
                title="padlock"
                appearance={{ size: 'extraTiny' }}
                name="emoji-padlock-closed"
              />
              <Numeral
                className={styles.lockedAmount}
                value={lockedTokens}
                suffix={` ${token?.symbol}`}
                unit={tokenDecimals}
                truncate={3}
              />
            </div>
          </li>
          <li>
            <div className={styles.listItem}>
              <div className={styles.redDisc} />
              <p className={styles.listItemTitle}>
                <FormattedMessage {...MSG.inactive} />
              </p>
            </div>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={inactiveTokens}
                suffix={` ${token?.symbol}`}
                unit={tokenDecimals}
                truncate={3}
              />
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.changeTokensState}>
        <div className={styles.changeStateTitle}>
          <FormattedMessage {...MSG.changeState} />
        </div>
        <div className={styles.changeStateButtonsContainer}>
          <Button
            appearance={{ theme: isActivate ? 'primary' : 'secondary' }}
            className={!isActivate ? styles.leftBorders : ''}
            onClick={() => setIsActivate(true)}
            text={MSG.activate}
          />
          <Button
            appearance={{ theme: !isActivate ? 'primary' : 'secondary' }}
            className={isActivate ? styles.rightBorders : ''}
            onClick={() => setIsActivate(false)}
            text={MSG.withdraw}
          />
        </div>
        <TokensTabForm
          token={token}
          isActivate={isActivate}
          tokenDecimals={tokenDecimals}
          activeTokens={activeTokens}
          inactiveTokens={inactiveTokens}
        />
      </div>
    </>
  );
};

export default TokensTab;
