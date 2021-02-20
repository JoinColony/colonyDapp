import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Icon from '~core/Icon';
import TokenIcon from '~dashboard/HookedTokenIcon';

import styles from './TokenActivationContent.css';

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
  activeTokens: number;
  inactiveTokens: number;
  tokenSymbol: string;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  tokenSymbol,
}: TokensTabProps) => {
  const [isActivate, setIsActivate] = useState(true);

  return (
    <>
      <div className={styles.totalTokensContainer}>
        {/* @ts-ignore */}
        <TokenIcon token={{}} size="xs" />
        <p className={styles.totalTokens}>
          {activeTokens + inactiveTokens} <span>{tokenSymbol}</span>
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
            <div
              className={styles.tokenNumbers}
            >{`${activeTokens} ${tokenSymbol}`}</div>
            <div className={styles.previousTotalAmount}>
              <Icon
                title="padlock"
                appearance={{ size: 'extraTiny' }}
                name="emoji-padlock-closed"
              />
              <p>{`18,000 ${tokenSymbol} !!!!! PLACEHOLDER`}</p>
            </div>
          </li>
          <li>
            <div className={styles.listItem}>
              <div className={styles.redDisc} />
              <p className={styles.listItemTitle}>
                <FormattedMessage {...MSG.inactive} />
              </p>
            </div>
            <div
              className={styles.tokenNumbers}
            >{`${inactiveTokens} ${tokenSymbol}`}</div>
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
      </div>
    </>
  );
};

export default TokensTab;
