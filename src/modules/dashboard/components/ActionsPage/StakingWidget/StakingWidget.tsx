import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import * as yup from 'yup';
import { Decimal } from 'decimal.js';

import { ActionForm } from '~core/Fields';
import Button from '~core/Button';
import { MiniSpinnerLoader } from '~core/Preloaders';
import { useDialog } from '~core/Dialog';
import RaiseObjectionDialog from '~dialogs/RaiseObjectionDialog';

import {
  useLoggedInUser,
  useMotionStakesQuery,
  useUserBalanceWithLockQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload, pipe } from '~utils/actions';

import styles from './StakingWidget.css';
import StakingSlider, { StakingAmounts } from './StakingSlider';
import { Props as StakingFlowProps } from './StakingWidgetFlow';

Decimal.set({ toExpPos: 78 });

export interface Props extends StakingFlowProps {
  isObjection: boolean;
  handleWidgetState: (isObjection: boolean) => void;
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
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

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
        ...stakingAmounts,
      }),
    [colony, openRaiseObjectionDialog, scrollToRef, motionId],
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
          const { minUserStake } = data.motionStakes;
          const stake = getDecimalStake(amount);
          const stakeWithMin = new Decimal(minUserStake).gte(stake)
            ? new Decimal(minUserStake)
            : stake;
          return {
            amount: stakeWithMin.round().toString(),
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

  const enoughTokens = userActivatedTokens.gte(userStakeBottomLimit);

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
    enoughTokens &&
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

  return (
    <div className={styles.main} data-test="stakingWidget">
      <ActionForm
        initialValues={{
          amount: 0,
        }}
        validationSchema={validationSchema}
        submit={ActionTypes.COLONY_MOTION_STAKE}
        error={ActionTypes.COLONY_MOTION_STAKE_ERROR}
        success={ActionTypes.COLONY_MOTION_STAKE_SUCCESS}
        transform={transform}
        onSuccess={handleSuccess}
      >
        {({ values }) => (
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
            />
            <div className={styles.buttonGroup}>
              <Button
                appearance={{
                  theme: isObjection ? 'danger' : 'primary',
                  size: 'medium',
                }}
                type="submit"
                disabled={
                  !canBeStaked ||
                  userActivatedTokens.lt(getDecimalStake(values.amount))
                }
                text={MSG.stakeButton}
                dataTest="stakeWidgetStakeButton"
              />
              <span
                className={
                  !bigNumberify(totalNAYStakes).isZero()
                    ? styles.backButtonWrapper
                    : styles.objectButton
                }
              >
                {isObjection || !bigNumberify(totalNAYStakes).isZero() ? (
                  <Button
                    appearance={{ theme: 'secondary', size: 'medium' }}
                    text={{ id: 'button.back' }}
                    onClick={() => handleWidgetState(true)}
                  />
                ) : (
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
                )}
              </span>
              {!enoughTokens && (
                <Button
                  appearance={{
                    theme: 'primary',
                    size: 'medium',
                  }}
                  text={MSG.activateButton}
                />
              )}
            </div>
          </div>
        )}
      </ActionForm>
    </div>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
