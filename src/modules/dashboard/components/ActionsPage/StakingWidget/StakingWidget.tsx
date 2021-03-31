import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';
import RaiseObjectionDialog from '~dashboard/RaiseObjectionDialog';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { mapPayload, pipe } from '~utils/actions';

import styles from './StakingWidget.css';

type Props = {
  motionId: string;
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

const StakingWidget = ({ motionId, colonyAddress }: Props) => {
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

  const handleRaiseObjection = useCallback(
    () => openRaiseObjectionDialog({ colonyAddress }),
    [colonyAddress, openRaiseObjectionDialog],
  );

  const validationSchema = yup.object().shape({
    amount: yup.number().required().moreThan(0),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ stakeAmount }) => {
        return {
          amount: stakeAmount,
          colonyAddress,
          motionId,
          vote: 1,
        };
      }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        stakeAmount: 0,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
      transform={transform}
    >
      {({ values, handleChange, isValid }) => (
        <div className={styles.wrapper}>
          <Heading text={MSG.title} className={styles.title} />
          <p className={styles.description}>
            <FormattedMessage {...MSG.description} />
          </p>
          <span className={styles.amount}>{values.stakeAmount}</span>
          <Slider
            name="stakeAmount"
            value={values.stakeAmount}
            onChange={handleChange}
          />
          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              disabled={!isValid || values.amount === undefined}
              text={MSG.stakeButton}
            />
            <Button
              appearance={{ theme: 'pink' }}
              text={MSG.objectButton}
              onClick={handleRaiseObjection}
            />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
