import React, { useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Decimal } from 'decimal.js';
import { bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import Slider, { Appearance } from '~core/Slider';
import Numeral from '~core/Numeral';
import StakingValidationError from '~dashboard/ActionsPage/StakingValidationError';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { Colony, useLoggedInUser } from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './StakingWidget.css';
import validationErrorStyles from '~dashboard/ActionsPage/StakingValidationError/StakingValidationError.css';

export interface StakingAmounts {
  remainingToFullyYayStaked: string;
  remainingToFullyNayStaked: string;
  maxUserStake: string;
  minUserStake: string;
  userActivatedTokens: Decimal;
}

interface Props extends StakingAmounts {
  colony: Colony;
  appearance?: Appearance;
  values: {
    amount: any;
  };
  canUserStake: boolean;
  isObjection: boolean;
}

const displayName = 'StakingSlider';

const MSG = defineMessages({
  titleStake: {
    id: 'dashboard.ActionsPage.StakingSlider.title',
    defaultMessage: `Select the amount to back the motion`,
  },
  titleObject: {
    id: 'dashboard.ActionsPage.StakingSlider.title',
    defaultMessage: `Select the amount to stake the objection`,
  },
  descriptionStake: {
    id: 'dashboard.ActionsPage.StakingSlider.description',
    defaultMessage: `Stake is returned if the motion passes. If there is a dispute, and the motion loses, part or all of your stake will be lost.`,
  },
  descriptionObject: {
    id: 'dashboard.ActionsPage.StakingSlider.description',
    defaultMessage: `Stake will be returned if the objection succeeds. If the objection fails, part or all of your stake will be lost.`,
  },
  loading: {
    id: 'dashboard.ActionsPage.StakingSlider.loading',
    defaultMessage: 'Loading staking values ...',
  },
  minimumAmount: {
    id: 'dashboard.ActionsPage.StakingSlider.minimumAmount',
    defaultMessage: 'at least {minStake}',
  },
  stakingToolTip: {
    id: 'dashboard.ActionsPage.StakingSlider.stakingToolTip',
    defaultMessage: `Staking involves committing an amount of tokens as collateral to support your decision.`,
  },
});

const StakingSlider = ({
  colony: { tokens, nativeTokenAddress },
  values,
  remainingToFullyYayStaked,
  remainingToFullyNayStaked,
  maxUserStake,
  minUserStake,
  canUserStake,
  appearance,
  userActivatedTokens,
  isObjection,
}: Props) => {
  const [limitExceeded, setLimitExceeded] = useState(false);
  const { ethereal } = useLoggedInUser();

  const onLimitExceeded = (isLimitExceeded: boolean) =>
    setLimitExceeded(isLimitExceeded);

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const remainingToStake = new Decimal(
    isObjection ? remainingToFullyNayStaked : remainingToFullyYayStaked,
  );

  const maxStake = new Decimal(maxUserStake);

  const userStakeLimitPercentage = remainingToStake.lte(minUserStake)
    ? new Decimal(0)
    : (maxStake.gte(userActivatedTokens) ? userActivatedTokens : maxStake)
        .minus(minUserStake)
        .div(remainingToStake.minus(minUserStake));

  const stake = new Decimal(values.amount)
    .div(100)
    .times(remainingToStake.minus(minUserStake))
    .plus(minUserStake);
  const stakeWithMin = new Decimal(minUserStake).gte(stake)
    ? new Decimal(minUserStake)
    : stake;
  const displayStake = getFormattedTokenValue(
    stakeWithMin.round().toString(),
    nativeToken?.decimals,
  );

  const errorStakeType = useMemo(() => {
    if (!ethereal) {
      const enoughTokens = userActivatedTokens.gte(minUserStake);
      const enoughReputation =
        bigNumberify(maxUserStake).gt(0) &&
        bigNumberify(maxUserStake).gte(bigNumberify(minUserStake));

      if (!enoughReputation) {
        return 'reputation';
      }

      if (!enoughTokens) {
        return 'tokens';
      }

      if (remainingToStake.lte(minUserStake) && !remainingToStake.isZero()) {
        return 'cantStakeMore';
      }

      if (userActivatedTokens.gt(maxStake) && maxStake.lt(remainingToStake)) {
        return 'stakeMoreReputation';
      }

      if (limitExceeded) {
        return 'stakeMoreTokens';
      }
    }
    return null;
  }, [
    remainingToStake,
    minUserStake,
    maxStake,
    userActivatedTokens,
    ethereal,
    limitExceeded,
    maxUserStake,
  ]);

  return (
    <>
      <div className={styles.title}>
        <Heading
          text={isObjection ? MSG.titleObject : MSG.titleStake}
          className={styles.title}
          appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
        />
        <QuestionMarkTooltip
          tooltipText={MSG.stakingToolTip}
          className={styles.questionMarkIcon}
          tooltipClassName={styles.tooltip}
          showArrow={false}
          tooltipPopperOptions={{
            placement: 'top-end',
          }}
        />
      </div>
      <p className={styles.description}>
        <FormattedMessage
          {...(isObjection ? MSG.descriptionObject : MSG.descriptionStake)}
        />
      </p>
      {errorStakeType === 'tokens' ? (
        <span className={styles.minStakeAmount}>
          <FormattedMessage
            {...MSG.minimumAmount}
            values={{
              minStake: (
                <Numeral
                  className={styles.minStakeAmount}
                  value={getFormattedTokenValue(
                    minUserStake,
                    nativeToken?.decimals,
                  )}
                  suffix={nativeToken?.symbol}
                />
              ),
            }}
          />
        </span>
      ) : (
        <Numeral
          className={styles.amount}
          value={displayStake}
          suffix={nativeToken?.symbol}
        />
      )}
      <div className={styles.sliderContainer}>
        <Slider
          name="amount"
          value={values.amount}
          limit={userStakeLimitPercentage}
          step={1}
          min={0}
          max={100}
          disabled={!canUserStake}
          appearance={appearance}
          handleLimitExceeded={onLimitExceeded}
        />
      </div>
      {errorStakeType && (
        <StakingValidationError
          stakeType={errorStakeType}
          errorValues={{
            leftToActivate: (
              <Numeral
                className={validationErrorStyles.validationErrorValues}
                value={getFormattedTokenValue(
                  new Decimal(minUserStake).sub(userActivatedTokens).toString(),
                  nativeToken?.decimals,
                )}
                key={1}
              />
            ),
            tokenSymbol: nativeToken?.symbol,
            minimumStake: (
              <Numeral
                className={validationErrorStyles.validationError}
                value={displayStake}
                suffix={nativeToken?.symbol}
              />
            ),
            userActiveTokens: (
              <Numeral
                className={validationErrorStyles.validationError}
                value={getFormattedTokenValue(
                  userActivatedTokens.toString(),
                  nativeToken?.decimals,
                )}
                suffix={nativeToken?.symbol}
              />
            ),
            minimumReputation: (
              <Numeral
                className={validationErrorStyles.validationError}
                value={getFormattedTokenValue(
                  minUserStake.toString(),
                  nativeToken?.decimals,
                )}
              />
            ),
            userReputation: (
              <Numeral
                className={validationErrorStyles.validationError}
                value={getFormattedTokenValue(
                  maxUserStake.toString(),
                  nativeToken?.decimals,
                )}
              />
            ),
          }}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
