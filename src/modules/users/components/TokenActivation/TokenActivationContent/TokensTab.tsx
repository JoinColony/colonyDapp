import React, { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import Button from '~core/Button';
import Icon from '~core/Icon';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { Tooltip } from '~core/Popover';

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
  activeTokensTooltip: {
    id:
      // eslint-disable-next-line max-len
      'users.TokenActivation.TokenActivationContent.TokensTab.activeTokensTooltip',
    defaultMessage: `Tokens are “Active” when they’ve been deposited to a
     contract which lets them get ‘locked’ when you need to stake,
     or claim a share of Rewards. You can withdraw tokens back
     to your wallet any time, you just need to clear any locks first.`,
  },
  inactiveTokensTooltip: {
    id:
      // eslint-disable-next-line max-len
      'users.TokenActivation.TokenActivationContent.TokensTab.inactiveTokensTooltip',
    defaultMessage: `Inactive tokens are contained in your own wallet.
     You need to “Activate” them to stake, or be eligible to receive Rewards.`,
  },
  lockedTokensTooltip: {
    id:
      // eslint-disable-next-line max-len
      'users.TokenActivation.TokenActivationContent.TokensTab.lockedTokensTooltip',
    defaultMessage: `You have unclaimed transactions which must be claimed
     before these tokens can be withdrawn.`,
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
            <Tooltip
              darkTheme
              placement="top-start"
              content={<FormattedMessage {...MSG.activeTokensTooltip} />}
            >
              {({ close, open, ref }) => (
                <div
                  className={styles.listItemActive}
                  ref={ref}
                  onMouseEnter={open}
                  onMouseLeave={close}
                >
                  <FormattedMessage {...MSG.active} />
                </div>
              )}
            </Tooltip>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={activeTokens}
                suffix={` ${token?.symbol}`}
                unit={tokenDecimals}
                truncate={3}
              />
            </div>
            <Tooltip
              darkTheme
              placement="top-start"
              content={<FormattedMessage {...MSG.inactiveTokensTooltip} />}
            >
              {({ close, open, ref }) => (
                <div
                  className={styles.lockedAmountContainer}
                  ref={ref}
                  onMouseEnter={open}
                  onMouseLeave={close}
                >
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
              )}
            </Tooltip>
          </li>
          <li>
            <Tooltip
              darkTheme
              placement="top-start"
              content={<FormattedMessage {...MSG.inactiveTokensTooltip} />}
            >
              {({ close, open, ref }) => (
                <div
                  className={styles.listItemInactive}
                  ref={ref}
                  onMouseEnter={open}
                  onMouseLeave={close}
                >
                  <FormattedMessage {...MSG.inactive} />
                </div>
              )}
            </Tooltip>
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
          <div
            className={
              isActivate ? styles.activateButton : styles.activateButtonInactive
            }
          >
            <Button
              appearance={{ theme: isActivate ? 'primary' : 'white' }}
              onClick={() => setIsActivate(true)}
              text={MSG.activate}
            />
          </div>
          <div
            className={
              isActivate ? styles.withdrawButtonInactive : styles.withdrawButton
            }
          >
            <Button
              appearance={{ theme: !isActivate ? 'primary' : 'white' }}
              onClick={() => setIsActivate(false)}
              text={MSG.withdraw}
            />
          </div>
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
