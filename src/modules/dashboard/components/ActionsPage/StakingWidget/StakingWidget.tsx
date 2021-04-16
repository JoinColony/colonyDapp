import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { bigNumberify } from 'ethers/utils';

import {
  useLoggedInUser,
  useStakeMotionLimitsQuery,
  useUserColonyAddressesQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import { Address } from '~types/index';
import { mapPayload, pipe } from '~utils/actions';

import styles from './StakingWidget.css';
import Button from '~core/Button';

type Props = {
  motionId: number;
  motionDomainId: number;
  rootHash: string;
  colonyAddress: Address;
  tokenDecimals: number;
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
  motionId,
  motionDomainId,
  rootHash,
  colonyAddress,
  tokenDecimals,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const { data, loading } = useStakeMotionLimitsQuery({
    variables: {
      colonyAddress,
      userAddress: walletAddress,
      motionId,
      rootHash,
    },
  });
  const { data: userColonyAddressesData } = useUserColonyAddressesQuery({
    variables: { address: walletAddress },
  });
  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        return {
          amount: bigNumberify(amount).mul(bigNumberify(10).pow(tokenDecimals)),
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

  if (loading || !data?.stakeMotionLimits || !userColonyAddressesData?.user) {
    return null;
  }

  const {
    user: { colonyAddresses },
  } = userColonyAddressesData;

  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  const { minStake, maxStake, requiredStake } = data.stakeMotionLimits;

  return (
    <ActionForm
      initialValues={{
        amount: minStake,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
      transform={transform}
    >
      {({ values, isValid }) => (
        <div className={styles.wrapper}>
          <Heading text={MSG.title} className={styles.title} />
          <p className={styles.description}>
            <FormattedMessage {...MSG.description} />
          </p>
          <span className={styles.amount}>{values.amount}</span>
          <Slider
            name="amount"
            value={values.amount}
            min={minStake}
            max={requiredStake}
            limit={maxStake}
          />
          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              disabled={!isValid || !isSubscribed}
              text={MSG.stakeButton}
            />
            <Button appearance={{ theme: 'pink' }} text={MSG.objectButton} />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
