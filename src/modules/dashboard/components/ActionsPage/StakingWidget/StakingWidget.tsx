import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';

import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import Button from '~core/Button';

import {
  Colony,
  useLoggedInUser,
  useStakeMotionLimitsQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload, pipe } from '~utils/actions';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import styles from './StakingWidget.css';

type Props = {
  colony: Colony;
  motionId: number;
  motionDomainId: number;
  rootHash: string;
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
});

const StakingWidget = ({
  colony: { colonyAddress, tokens, nativeTokenAddress },
  motionId,
  motionDomainId,
  rootHash,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const { data, loading } = useStakeMotionLimitsQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
      rootHash,
    },
  });

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        return {
          amount: bigNumberify(amount).mul(
            bigNumberify(10).pow(
              nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS,
            ),
          ),
          userAddress: walletAddress,
          rootHash,
          colonyAddress,
          motionId: bigNumberify(motionId),
          motionDomainId,
          vote: bigNumberify(1),
        };
      }),
    ),
    [walletAddress, colonyAddress, motionId],
  );

  /*
   * @TODO Add proper loading state
   */
  if (loading || !data?.stakeMotionLimits) {
    return <div>Loading</div>;
  }

  const hasRegisteredProfile = !!username && !ethereal;
  const { minStake, maxStake, requiredStake } = data.stakeMotionLimits;

  return (
    <ActionForm
      initialValues={{
        amount: minStake,
      }}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
      transform={transform}
    >
      {({ values }) => (
        <div className={styles.wrapper}>
          <Heading text={MSG.title} className={styles.title} />
          <p className={styles.description}>
            <FormattedMessage {...MSG.description} />
          </p>
          <span className={styles.amount}>{values.amount}</span>
          <div className={styles.sliderContainer}>
            <Slider
              name="amount"
              value={values.amount}
              min={minStake}
              max={requiredStake}
              limit={maxStake}
              disabled={!hasRegisteredProfile}
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              disabled={!hasRegisteredProfile}
              text={MSG.stakeButton}
            />
            <Button
              appearance={{ theme: 'danger' }}
              text={MSG.objectButton}
              disabled={!hasRegisteredProfile}
            />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
