import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { ActionTypes } from '~redux/index';
import Heading from '~core/Heading';
import { ActionForm } from '~core/Fields';
import Slider from '~core/Slider';

import styles from './StakingWidget.css';
import Button from '~core/Button';

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
});

const StakingWidget = () => {
  const validationSchema = yup.object().shape({
    amount: yup.number().required().moreThan(0),
  });

  return (
    <ActionForm
      initialValues={{
        stakeAmount: 0,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
    >
      {({ values, handleChange }) => (
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
            <Button>Stake</Button>
            <Button appearance={{ theme: 'pink' }}>Object</Button>
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
