import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Decimal } from 'decimal.js';

import Heading from '~core/Heading';
import Slider, { Appearance } from '~core/Slider';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { Colony } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './StakingWidget.css';

export interface StakingAmounts {
  remainingToFullyYayStaked: string;
  remainingToFullyNayStaked: string;
  maxUserStake: string;
  minUserStake: string;
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
  stakingTooltip: {
    id: 'dashboard.ActionsPage.StakingSlider.stakingTooltip',
    defaultMessage: '[TO BE ADDED]',
  },
  loading: {
    id: 'dashboard.ActionsPage.StakingSlider.loading',
    defaultMessage: 'Loading staking values ...',
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
  isObjection,
}: Props) => {
  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const remainingToStake = new Decimal(
    isObjection ? remainingToFullyNayStaked : remainingToFullyYayStaked,
  );

  const userStakeLimitPercentage = new Decimal(maxUserStake)
    .div(remainingToStake)
    .times(100);

  const stake = new Decimal(values.amount).times(remainingToStake).div(100);
  const stakeWithMin = new Decimal(minUserStake).gte(stake)
    ? new Decimal(minUserStake)
    : stake;
  const displayStake = stakeWithMin
    .div(
      new Decimal(10).pow(getTokenDecimalsWithFallback(nativeToken?.decimals)),
    )
    .toFixed(2);

  return (
    <>
      <div className={styles.title}>
        <Heading
          text={isObjection ? MSG.titleObject : MSG.titleStake}
          className={styles.title}
          appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
        />
        <QuestionMarkTooltip
          tooltipText={MSG.stakingTooltip}
          className={styles.help}
          tooltipClassName={styles.tooltip}
          tooltipPopperProps={{
            placement: 'right',
          }}
        />
      </div>
      <p className={styles.description}>
        <FormattedMessage
          {...(isObjection ? MSG.descriptionObject : MSG.descriptionStake)}
        />
      </p>
      <span
        className={styles.amount}
      >{`${displayStake} ${nativeToken?.symbol}`}</span>
      <div className={styles.sliderContainer}>
        <Slider
          name="amount"
          value={values.amount}
          limit={parseFloat(userStakeLimitPercentage.toFixed(2))}
          step={0.01}
          min={0}
          max={100}
          disabled={!canUserStake}
          appearance={appearance}
        />
      </div>
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
