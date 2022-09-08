import React, { useCallback, useContext, useState } from 'react';
import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import * as yup from 'yup';
import { Decimal } from 'decimal.js';

import { ActionForm } from '~core/Fields';
import Button from '~core/Button';
import { MiniSpinnerLoader } from '~core/Preloaders';
import { useDialog } from '~core/Dialog';
import RaiseObjectionDialog from '~dialogs/RaiseObjectionDialog';
import { TokenActivationContext } from '~users/TokenActivationProvider';

import {
  useLoggedInUser,
  useMotionStakesQuery,
  useUserBalanceWithLockQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload, pipe } from '~utils/actions';
import { log } from '~utils/debug';

import styles from './StakingWidget.css';
import StakingSlider, { StakingAmounts } from './StakingSlider';
import { Props as StakingFlowProps } from './StakingWidgetFlow';

Decimal.set({ toExpPos: 78 });

export interface Props extends StakingFlowProps {
  isObjection: boolean;
  handleWidgetState: (isObjection: boolean) => void;
  isDecision: boolean;
  totalPercentage: number;
}

const displayName = 'StakingWidget';

const MSG = defineMessages({
  stakeButton: {
    id: 'dashboard.ActionsPage.StakingWidget.stakeButton',
    defaultMessage: 'Stake',
  },
  objectButton: {
    id: 'dashboard.ActionsPage.StakingWidget.objectButton',
    defaultMessage: 'Object',
  },
  activateButton: {
    id: 'dashboard.ActionsPage.StakingWidget.activateButton',
    defaultMessage: 'Activate',
  },
  stakingTooltip: {
    id: 'dashboard.ActionsPage.StakingWidget.stakingTooltip',
    defaultMessage: '[TO BE ADDED]',
  },
  loading: {
    id: 'dashboard.ActionsPage.StakingWidget.loading',
    defaultMessage: 'Loading staking values ...',
  },
});

const validationSchema = yup.object({
  amount: yup.number(),
});

const StakingWidget = ({
  colony,
  colony: { colonyAddress, nativeTokenAddress },
  motionId,
  scrollToRef,
  isObjection,
  handleWidgetState,
  isDecision,
  totalPercentage,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const [sliderAmount, setSliderAmount] = useState(0);

  const { setIsOpen: openTokenActivationPopover } = useContext(
    TokenActivationContext,
  );

  const { data, loading } = useMotionStakesQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: userData,
    loading: userDataLoading,
  } = useUserBalanceWithLockQuery({
    variables: {
      address: walletAddress,
      tokenAddress: nativeTokenAddress,
      colonyAddress,
    },
  });
  const userActivatedTokens = new Decimal(
    userData?.user?.userLock?.balance || 0,
  );

  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

  const handleRaiseObjection = useCallback(
    (userHasPermission: boolean, stakingAmounts: StakingAmounts) =>
      openRaiseObjectionDialog({
        motionId,
        colony,
        canUserStake: userHasPermission,
        scrollToRef,
        isDecision,
        ...stakingAmounts,
      }),
    [colony, openRaiseObjectionDialog, scrollToRef, motionId, isDecision],
  );

  const getDecimalStake = useCallback(
    (stake: number) => {
      if (data?.motionStakes) {
        const {
          remainingToFullyNayStaked,
          remainingToFullyYayStaked,
          minUserStake,
        } = data.motionStakes;
        const remainingToStake = new Decimal(
          isObjection ? remainingToFullyNayStaked : remainingToFullyYayStaked,
        );

        return new Decimal(stake)
          .div(100)
          .times(remainingToStake.minus(minUserStake))
          .plus(minUserStake);
      }
      return new Decimal(0);
    },
    [data, isObjection],
  );

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        if (data?.motionStakes) {
          const {
            minUserStake,
            maxUserStake,
            remainingToFullyNayStaked,
            remainingToFullyYayStaked,
          } = data.motionStakes;

          let finalStake;
          const stake = getDecimalStake(amount);

          if (amount === 100) {
            finalStake = maxUserStake;
          } else if (amount === 0 || new Decimal(minUserStake).gte(stake)) {
            finalStake = minUserStake;
          } else {
            finalStake = stake.round().toString();
          }

          log.verbose('Staking values: ', {
            minUserStake,
            maxUserStake,
            remainingToFullyNayStaked,
            remainingToFullyYayStaked,
            stake: stake.toString(),
            finalStake,
          });

          return {
            amount: finalStake,
            userAddress: walletAddress,
            colonyAddress,
            motionId: bigNumberify(motionId),
            vote: isObjection ? 0 : 1,
          };
        }
        return null;
      }),
    ),
    [walletAddress, colonyAddress, motionId, data, isObjection],
  );

  const handleSuccess = useCallback(
    (_, { setFieldValue, resetForm }) => {
      resetForm({});
      setFieldValue('amount', 0);
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [scrollToRef],
  );

  if (loading || userDataLoading || !data?.motionStakes) {
    return (
      <div className={styles.main}>
        <MiniSpinnerLoader
          className={styles.loading}
          loadingText={MSG.loading}
        />
      </div>
    );
  }

  const hasRegisteredProfile = !!username && !ethereal;
  const {
    totalNAYStakes,
    remainingToFullyYayStaked,
    remainingToFullyNayStaked,
    maxUserStake,
    minUserStake,
  } = data.motionStakes;

  const userStakeBottomLimit = new Decimal(minUserStake);

  const enoughReputation =
    bigNumberify(maxUserStake).gt(0) &&
    bigNumberify(maxUserStake).gte(bigNumberify(minUserStake));

  const remainingToStake = new Decimal(
    isObjection ? remainingToFullyNayStaked : remainingToFullyYayStaked,
  );

  const maxStake = new Decimal(maxUserStake);

  const userStakeLimitPercentage = remainingToStake.lte(minUserStake)
    ? new Decimal(0)
    : (maxStake.gte(userActivatedTokens) ? userActivatedTokens : maxStake)
        .minus(minUserStake)
        .div(remainingToStake.minus(minUserStake));

  const enoughActiveTokensToStakeMore = userStakeLimitPercentage
    .mul(100)
    .gt(sliderAmount);

  const isMinActivated = userActivatedTokens.gte(userStakeBottomLimit);

  const canUserStake =
    /*
     * Has a profile registered
     */
    hasRegisteredProfile &&
    /*
     * User has enough reputation to stake
     */
    enoughReputation &&
    /*
     * Activated tokens are more than the minimum required stake amount
     */
    isMinActivated &&
    /*
     * Has activated tokens
     */
    userActivatedTokens.gt(0);

  /*
   * Motion can be still staked (ie: amount left to stake)
   */
  const canUserStakeYay =
    canUserStake && new Decimal(remainingToFullyYayStaked).gt(0);
  const canUserStakeNay =
    canUserStake && new Decimal(remainingToFullyNayStaked).gt(0);

  const canBeStaked = isObjection ? canUserStakeNay : canUserStakeYay;
  const showActivateButton =
    enoughReputation &&
    canBeStaked &&
    (!isMinActivated || !enoughActiveTokensToStakeMore);

  return (
    <div className={styles.main} data-test="stakingWidget">
      <ActionForm
        initialValues={{
          amount: 0,
        }}
        validationSchema={validationSchema}
        submit={ActionTypes.MOTION_STAKE}
        error={ActionTypes.MOTION_STAKE_ERROR}
        success={ActionTypes.MOTION_STAKE_SUCCESS}
        transform={transform}
        onSuccess={handleSuccess}
      >
        {({ values }) => {
          setSliderAmount(values.amount);
          return (
            <div className={styles.wrapper}>
              <StakingSlider
                colony={colony}
                canUserStake={canBeStaked}
                values={values}
                appearance={{
                  theme: isObjection ? 'danger' : 'primary',
                  size: 'thick',
                }}
                isObjection={isObjection}
                remainingToFullyYayStaked={remainingToFullyYayStaked}
                remainingToFullyNayStaked={remainingToFullyNayStaked}
                maxUserStake={maxUserStake}
                minUserStake={minUserStake}
                userActivatedTokens={userActivatedTokens}
                totalPercentage={totalPercentage}
              />
              <div
                className={`${styles.buttonGroup} ${
                  showActivateButton ? styles.buttonGroupAlignment : ''
                }`}
              >
                {!bigNumberify(totalNAYStakes).isZero() && (
                  <Button
                    appearance={{ theme: 'secondary', size: 'medium' }}
                    text={{ id: 'button.back' }}
                    onClick={() => handleWidgetState(true)}
                  />
                )}
                <Button
                  appearance={{
                    theme: isObjection ? 'danger' : 'primary',
                    size: 'medium',
                  }}
                  type="submit"
                  disabled={
                    !canBeStaked ||
                    userActivatedTokens.lt(
                      getDecimalStake(values.amount).round(),
                    )
                  }
                  text={MSG.stakeButton}
                  dataTest="stakeWidgetStakeButton"
                />

                {bigNumberify(totalNAYStakes).isZero() && (
                  <span
                    className={!showActivateButton ? styles.objectButton : ''}
                  >
                    <Button
                      appearance={{ theme: 'pink', size: 'medium' }}
                      text={MSG.objectButton}
                      disabled={!canUserStakeNay}
                      onClick={() =>
                        bigNumberify(totalNAYStakes).isZero()
                          ? handleRaiseObjection(canUserStake, {
                              ...data.motionStakes,
                              userActivatedTokens,
                            })
                          : handleWidgetState(true)
                      }
                      dataTest="stakeWidgetObjectButton"
                    />
                  </span>
                )}
                {showActivateButton && (
                  <Button
                    appearance={{
                      theme: 'primary',
                      size: 'medium',
                    }}
                    text={MSG.activateButton}
                    onClick={() => openTokenActivationPopover(true)}
                  />
                )}
              </div>
            </div>
          );
        }}
      </ActionForm>
    </div>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
