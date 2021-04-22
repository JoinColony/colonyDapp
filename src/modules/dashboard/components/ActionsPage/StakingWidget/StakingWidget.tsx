import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import Button from '~core/Button';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { MiniSpinnerLoader } from '~core/Preloaders';

import { Colony, useLoggedInUser, useMotionStakesQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload, pipe } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './StakingWidget.css';

type Props = {
  colony: Colony;
  motionId: number;
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

const StakingWidget = ({
  colony: { colonyAddress, tokens, nativeTokenAddress },
  motionId,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const { data, loading } = useMotionStakesQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
  });

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const transform = useCallback(
    pipe(
      // eslint-disable-next-line consistent-return
      mapPayload(({ amount }) => {
        if (data?.motionStakes) {
          const { remainingToFullyYayStaked } = data.motionStakes;
          const maxStake = parseFloat(
            moveDecimal(
              remainingToFullyYayStaked,
              -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
            ),
          ).toFixed(2);
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
           * Required stake is 18.771889487905761358 but the slider can only
           * show 18.77 When we send this value, we'll do 18.77 + 0.01, that
           * way we ensure that we can fully stake
           */
          const safeAmount = maxStake === amount ? amount + 0.01 : amount;
          return {
            amount: bigNumberify(
              moveDecimal(
                safeAmount,
                getTokenDecimalsWithFallback(nativeToken?.decimals),
              ),
            ),
            userAddress: walletAddress,
            colonyAddress,
            motionId: bigNumberify(motionId),
            vote: 1,
          };
        }
      }),
    ),
    [walletAddress, colonyAddress, motionId, data],
  );

  const handleSuccess = useCallback(
    (setFieldValue, resetForm) => {
      if (data?.motionStakes) {
        const { minUserStake } = data.motionStakes;
        const userStakeBottomLimit = moveDecimal(
          minUserStake,
          -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
        );
        setFieldValue('amount', parseFloat(userStakeBottomLimit));
        resetForm();
      }
    },
    [data, nativeToken],
  );

  /*
   * @TODO Add proper loading state
   */
  if (loading || !data?.motionStakes) {
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

  const remainingToStake = moveDecimal(
    remainingToFullyYayStaked,
    -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
  );
  /*
   * This basically doubles as the user's reputation
   * So we can use it to also check if the user can actually stake
   * If the reputation is 0, they cannot stake at all
   */
  const userStakeTopLimit = moveDecimal(
    maxUserStake,
    -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
  );
  const userStakeBottomLimit = moveDecimal(
    minUserStake,
    -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
  );

  const canUserStake =
    hasRegisteredProfile &&
    bigNumberify(maxUserStake).gt(0) &&
    bigNumberify(maxUserStake).gte(bigNumberify(minUserStake));

  return (
    <div className={styles.main}>
      <ActionForm
        initialValues={{
          amount: parseFloat(userStakeBottomLimit),
        }}
        submit={ActionTypes.MOTION_STAKE}
        error={ActionTypes.MOTION_STAKE_ERROR}
        success={ActionTypes.MOTION_STAKE_SUCCESS}
        transform={transform}
        onSuccess={(_, { resetForm, setFieldValue }) =>
          handleSuccess(setFieldValue, resetForm)
        }
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
                min={parseFloat(userStakeBottomLimit)}
                max={parseFloat(remainingToStake)}
                limit={parseFloat(userStakeTopLimit)}
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
                appearance={{ theme: 'danger', size: 'medium' }}
                text={MSG.objectButton}
                disabled={!canUserStake}
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
