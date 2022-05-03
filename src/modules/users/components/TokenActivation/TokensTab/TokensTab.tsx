import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import { SMALL_TOKEN_AMOUNT_FORMAT } from '~constants';
import Icon from '~core/Icon';
import InfoPopover from '~core/InfoPopover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { FullColonyFragment } from '~data/index';
import Numeral from '~core/Numeral';

import { UserToken } from '~data/generated';
import { Address } from '~types/index';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import styles from './TokensTab.css';
import ChangeTokenStateForm from './ChangeTokenStateForm';
import TokenTooltip from './TokenTooltip';
import SmallTokenAmountMessage from './SmallTokenAmountMessage';

const MSG = defineMessages({
  active: {
    id: 'users.TokenActivation.TokensTab.active',
    defaultMessage: 'Active',
  },
  activeLocked: {
    id: 'users.TokenActivation.TokensTab.activeLocked',
    defaultMessage: 'Active',
  },
  staked: {
    id: 'users.TokenActivation.TokensTab.staked',
    defaultMessage: 'Staked',
  },
  inactive: {
    id: 'users.TokenActivation.TokensTab.inactive',
    defaultMessage: 'Inactive',
  },
  activeTokensTooltip: {
    id: 'users.TokenActivation.TokensTab.activeTokensTooltip',
    defaultMessage: `Tokens are “Active” when they’ve been deposited to a
      contract which lets them get ‘locked’ when you need to stake,
      or claim a share of Rewards. You can withdraw tokens back
      to your wallet any time, you just need to clear any locks first.`,
  },
  inactiveTokensTooltip: {
    id: 'users.TokenActivation.TokensTab.inactiveTokensTooltip',
    defaultMessage: `Inactive tokens are contained in your own wallet.
      You need to “Activate” them to stake, or be eligible to receive Rewards.`,
  },
  stakedTokensTooltip: {
    id: `TokenActivation.TokensTab.stakedTokensTooltip`,
    defaultMessage: `You have tokens staked in processes which must conclude
      before they can be deactivated.`,
  },
  pendingError: {
    id: 'users.TokenActivation.TokensTab.pendingError',
    defaultMessage: 'Error: balance pending!',
  },
  pendingErrorTooltip: {
    id: 'users.TokenActivation.TokensTab.pendingErrorTooltip',
    defaultMessage: 'Send any “Activate” transaction to claim pending balance.',
  },
});

export interface TokensTabProps {
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  totalTokens: BigNumber;
  lockedTokens: BigNumber;
  isPendingBalanceZero: boolean;
  token: UserToken;
  colony?: FullColonyFragment;
  walletAddress: Address;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  totalTokens,
  lockedTokens,
  token,
  colony,
  isPendingBalanceZero,
}: TokensTabProps) => {
  const targetRef = useRef<HTMLParagraphElement>(null);

  const [totalTokensWidth, setTotalTokensWidth] = useState(0);

  const widthLimit = 164;

  useLayoutEffect(() => {
    if (targetRef?.current && totalTokensWidth === 0) {
      setTotalTokensWidth(targetRef?.current?.offsetWidth);
    }
  }, [totalTokensWidth]);

  const hasLockedTokens = useMemo(() => !lockedTokens.isZero(), [lockedTokens]);

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(token?.decimals),
    [token],
  );

  const formattedTotalAmount = getFormattedTokenValue(
    totalTokens,
    token.decimals,
  );
  const formattedLockedTokens = getFormattedTokenValue(
    lockedTokens,
    token.decimals,
  );
  const formattedActiveTokens = getFormattedTokenValue(
    activeTokens,
    token.decimals,
  );
  const formattedInactiveTokens = getFormattedTokenValue(
    inactiveTokens,
    token.decimals,
  );

  return (
    <>
      <InfoPopover token={token} isTokenNative>
        <div className={styles.totalTokensContainer}>
          <div
            className={
              totalTokensWidth <= widthLimit
                ? styles.tokenSymbol
                : styles.tokenSymbolSmall
            }
          >
            <TokenIcon
              token={token || {}}
              size={totalTokensWidth <= widthLimit ? 'xs' : 'xxs'}
            />
          </div>
          <p
            ref={targetRef}
            className={
              totalTokensWidth <= widthLimit
                ? styles.totalTokens
                : styles.totalTokensSmall
            }
          >
            <Numeral value={formattedTotalAmount} suffix={token.symbol} />
          </p>
        </div>
      </InfoPopover>
      <div className={styles.tokensDetailsContainer}>
        <ul>
          <li>
            <TokenTooltip
              className={styles.listItemActive}
              content={<FormattedMessage {...MSG.activeTokensTooltip} />}
            >
              <FormattedMessage
                {...(!hasLockedTokens ? MSG.active : MSG.activeLocked)}
              />
            </TokenTooltip>
            <div className={styles.tokenNumbers}>
              <span data-test="activeTokens">
                <Numeral value={formattedActiveTokens} suffix={token.symbol} />
              </span>
              {formattedActiveTokens === SMALL_TOKEN_AMOUNT_FORMAT && (
                <SmallTokenAmountMessage />
              )}
            </div>
            <TokenTooltip
              className={styles.lockedTokens}
              content={<FormattedMessage {...MSG.stakedTokensTooltip} />}
            >
              <FormattedMessage {...MSG.staked} />
            </TokenTooltip>
          </li>
          <li>
            <div className={styles.tokenNumbersLocked}>
              <span data-test="stakedTokens">
                <Numeral value={formattedLockedTokens} suffix={token.symbol} />
              </span>
            </div>
          </li>
          <li>
            <TokenTooltip
              className={styles.listItemInactive}
              content={<FormattedMessage {...MSG.inactiveTokensTooltip} />}
            >
              <FormattedMessage {...MSG.inactive} />
            </TokenTooltip>
            <div className={styles.tokenNumbersInactive}>
              <span data-test="inactiveTokens">
                <Numeral
                  value={formattedInactiveTokens}
                  suffix={token.symbol}
                />
              </span>
              {formattedInactiveTokens === SMALL_TOKEN_AMOUNT_FORMAT && (
                <SmallTokenAmountMessage />
              )}
            </div>
            {!isPendingBalanceZero && (
              <div className={styles.pendingError}>
                <FormattedMessage {...MSG.pendingError} />
                <TokenTooltip
                  className={styles.questionmarkIcon}
                  content={<FormattedMessage {...MSG.pendingErrorTooltip} />}
                  popperOffset={[-5, 8]}
                >
                  <Icon
                    name="question-mark"
                    title={MSG.pendingError}
                    appearance={{ size: 'small' }}
                  />
                </TokenTooltip>
              </div>
            )}
          </li>
        </ul>
      </div>
      <ChangeTokenStateForm
        token={token}
        tokenDecimals={tokenDecimals}
        activeTokens={activeTokens}
        inactiveTokens={inactiveTokens}
        lockedTokens={lockedTokens}
        colonyAddress={colony?.colonyAddress || ''}
        hasLockedTokens={hasLockedTokens}
      />
    </>
  );
};

export default TokensTab;
