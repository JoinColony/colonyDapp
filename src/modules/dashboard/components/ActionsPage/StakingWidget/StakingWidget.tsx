import React, { useCallback, RefObject } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import * as yup from 'yup';

import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import Button from '~core/Button';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useLoggedInUser,
  useMotionStakesQuery,
  useUserBalanceWithLockQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload, pipe } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './StakingWidget.css';

type Props = {
  colony: Colony;
  motionId: number;
  scrollToRef?: RefObject<HTMLInputElement>;
  transactionHash: string;
  previousTotalStakeStep: (() => void) | null;
};

const displayName = 'StakingWidget';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.StakingWidget.title',
    defaultMessage: `Select the amount to back the motion`,
  },
  description: {
    id: 'dashboard.ActionsPage.StakingWidget.description',
    defaultMessage: `Stake is returned if the motion passes. If there is a dispute, and the motion loses, part or all of your stake will be lost.`,
  },
  stakeButton: {
    id: 'dashboard.ActionsPage.StakingWidget.stakeButton',
    defaultMessage: 'Stake',
  },
  objectButton: {
    id: 'dashboard.ActionsPage.StakingWidget.objectButton',
    defaultMessage: 'Object',
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
  colony: { colonyAddress, tokens, nativeTokenAddress },
  motionId,
  scrollToRef,
  transactionHash,
  previousTotalStakeStep,
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

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => ({
        amount: bigNumberify(
          moveDecimal(
            amount,
            getTokenDecimalsWithFallback(nativeToken?.decimals),
          ),
        ),
        userAddress: walletAddress,
        colonyAddress,
        motionId: bigNumberify(motionId),
        vote: 1,
        transactionHash,
      })),
    ),
    [walletAddress, colonyAddress, motionId, data],
  );

  const handleSuccess = useCallback(
    (_, { setFieldValue, resetForm }) => {
      if (data?.motionStakes) {
        const { minUserStake } = data.motionStakes;
        const userStakeBottomLimit = moveDecimal(
          minUserStake,
          -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
        );
        resetForm({});
        setFieldValue('amount', parseFloat(userStakeBottomLimit));
        scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [data, nativeToken, scrollToRef],
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
    remainingToFullyYayStaked,
    maxUserStake,
    minUserStake,
  } = data.motionStakes;

  const remainingToStake = parseFloat(
    moveDecimal(
      remainingToFullyYayStaked,
      -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
    ),
  );
  /*
   * @NOTE Compensate for the lack of granularity in the slider
   * This is in order to be able to fully stake a motion
   *
   * If we reached the max of what the slider can show, just add some
   * extra in order to ensure we reach the required stake
   *
   * We're relying on the contracts here, since we can sent over the
   * required stake limit, and the contract call will discard it
   * (no, it's not lost)
   *
   * Example:
   * This is so we can round values like 18.627870543008473 to 18.63
   */
  const remainingToStakeSafe =
    remainingToStake > 0
      ? Math.round(remainingToStake * 100) / 100
      : remainingToStake;
  /*
   * This basically doubles as the user's reputation
   * So we can use it to also check if the user can actually stake
   * If the reputation is 0, they cannot stake at all
   */
  const userStakeTopLimit = parseFloat(
    moveDecimal(
      maxUserStake,
      -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
    ),
  );
  const userActivatedTokens = parseFloat(
    moveDecimal(
      userData?.user?.userLock?.balance || 0,
      -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
    ),
  );
  const userStakeBottomLimit = parseFloat(
    moveDecimal(
      minUserStake,
      -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
    ),
  );

  const canUserStake =
    /*
     * Has a profile registered
     */
    hasRegisteredProfile &&
    /*
     * User has enough reputation to stake
     */
    bigNumberify(maxUserStake).gt(0) &&
    bigNumberify(maxUserStake).gte(bigNumberify(minUserStake)) &&
    /*
     * Motion can be still staked (ie: amount left to stake)
     */
    remainingToStakeSafe > 0 &&
    /*
     * Activated tokens are more than the minimum required stake amount
     */
    userActivatedTokens >= userStakeBottomLimit &&
    /*
     * Has activated tokens
     */
    userActivatedTokens > 0;

  return (
    <div className={styles.main}>
      <ActionForm
        initialValues={{
          amount: userStakeBottomLimit,
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
            <div className={styles.title}>
              <Heading
                text={MSG.title}
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
              <FormattedMessage {...MSG.description} />
            </p>
            <span className={styles.amount}>{`${parseFloat(
              values.amount,
            ).toFixed(2)} ${nativeToken?.symbol}`}</span>
            <div className={styles.sliderContainer}>
              <Slider
                name="amount"
                value={values.amount}
                min={userStakeBottomLimit}
                max={
                  remainingToStakeSafe < userStakeBottomLimit
                    ? userStakeBottomLimit
                    : remainingToStakeSafe
                }
                limit={
                  userStakeTopLimit < userActivatedTokens
                    ? userStakeTopLimit
                    : userActivatedTokens
                }
                step={0.01}
                disabled={!canUserStake}
              />
            </div>
            <div className={styles.buttonGroup}>
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                type="submit"
                disabled={!canUserStake}
                text={MSG.stakeButton}
              />
              <Button
                appearance={{
                  theme: previousTotalStakeStep ? 'ghost' : 'danger',
                  size: 'medium',
                }}
                text={
                  previousTotalStakeStep
                    ? { id: 'button.back' }
                    : MSG.objectButton
                }
                disabled={!previousTotalStakeStep && !canUserStake}
                onClick={previousTotalStakeStep || undefined}
              />
            </div>
          </div>
        )}
      </ActionForm>
    </div>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
