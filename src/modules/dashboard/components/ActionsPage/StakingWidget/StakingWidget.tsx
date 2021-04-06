import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { bigNumberify } from 'ethers/utils';

import { useLoggedInUser, useStakeMotionLimitsQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import { Address } from '~types/index';
import { mapPayload, pipe } from '~utils/actions';

import styles from './StakingWidget.css';
import Button from '~core/Button';

type Props = {
  motionId: string;
  motionDomainId: number;
  rootHash: string;
  colonyAddress: Address;
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
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const { data } = useStakeMotionLimitsQuery({
    variables: { colonyAddress, motionId },
  });
  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ amount }) => {
        return {
          amount: bigNumberify(amount),
          userAddress: walletAddress,
          rootHash,
          colonyAddress,
          motionId: bigNumberify(motionId),
          motionDomainId: bigNumberify(motionDomainId),
          vote: bigNumberify(1),
        };
      }),
    ),
    [walletAddress, colonyAddress, motionId],
  );

  return (
    <ActionForm
      initialValues={{
        amount: 125,
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
            max={data?.stakeMotionLimits?.maxStake}
          />
          <div className={styles.buttonGroup}>
            <Button type="submit" disabled={!isValid} text={MSG.stakeButton} />
            <Button appearance={{ theme: 'pink' }} text={MSG.objectButton} />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
