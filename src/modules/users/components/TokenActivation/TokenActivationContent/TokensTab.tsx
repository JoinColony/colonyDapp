import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import Icon from '~core/Icon';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';

import { UserToken } from '~data/generated';
import { Address } from '~types/index';
import { formatTokenValue } from '~utils/numbers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TokenActivationContent.css';
import ChangeTokenStateForm from './ChangeTokenStateForm';
import TokenTooltip from './TokenTooltip';

const MSG = defineMessages({
  active: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.active',
    defaultMessage: 'Active',
  },
  inactive: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.inactive',
    defaultMessage: 'Inactive',
  },
  activeTokensTooltip: {
    id: `users.TokenActivation.TokenActivationContent.TokensTab.activeTokensTooltip`,
    defaultMessage: `Tokens are “Active” when they’ve been deposited to a
     contract which lets them get ‘locked’ when you need to stake,
     or claim a share of Rewards. You can withdraw tokens back
     to your wallet any time, you just need to clear any locks first.`,
  },
  inactiveTokensTooltip: {
    id: `users.TokenActivation.TokenActivationContent.TokensTab.inactiveTokensTooltip`,
    defaultMessage: `Inactive tokens are contained in your own wallet.
     You need to “Activate” them to stake, or be eligible to receive Rewards.`,
  },
  lockedTokensTooltip: {
    id: `users.TokenActivation.TokenActivationContent.TokensTab.lockedTokensTooltip`,
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
  colonyAddress: Address;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  totalTokens,
  lockedTokens,
  token,
  colonyAddress,
}: TokensTabProps) => {
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
            <TokenTooltip
              className={styles.listItemActive}
              content={<FormattedMessage {...MSG.activeTokensTooltip} />}
            >
              <FormattedMessage {...MSG.active} />
            </TokenTooltip>
            <div className={styles.tokenNumbers}>
              <Numeral
                value={activeTokens}
                suffix={` ${token?.symbol}`}
                unit={tokenDecimals}
                truncate={3}
              />
            </div>
            <TokenTooltip
              className={styles.lockedAmountContainer}
              content={<FormattedMessage {...MSG.lockedTokensTooltip} />}
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
            </TokenTooltip>
          </li>
          <li>
            <TokenTooltip
              className={styles.listItemInactive}
              content={<FormattedMessage {...MSG.inactiveTokensTooltip} />}
            >
              <FormattedMessage {...MSG.inactive} />
            </TokenTooltip>
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
      <ChangeTokenStateForm
        token={token}
        tokenDecimals={tokenDecimals}
        activeTokens={activeTokens}
        inactiveTokens={inactiveTokens}
        colonyAddress={colonyAddress}
      />
    </>
  );
};

export default TokensTab;
