import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';

import VoteDetails from '../VoteWidget/VoteDetails';

import styles from './RevealWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  motionId: number;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.RevealWidget.title',
    defaultMessage: `Reveal your vote to others to claim your reward.`,
  },
  buttonReveal: {
    id: 'dashboard.ActionsPage.RevealWidget.buttonReveal',
    defaultMessage: `Reveal`,
  },
});

const validationSchema = yup.object().shape({
  vote: yup.number().required(),
});

const RevealWidget = ({
  colony: { colonyAddress },
  colony,
  motionId,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const transform = useCallback(
    mapPayload(({ vote }) => ({
      colonyAddress,
      walletAddress,
      vote: parseInt(vote, 10),
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{
        vote: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      transform={transform}
    >
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        values,
      }: FormikProps<FormValues>) => (
        <div className={styles.main}>
          <Heading
            text={MSG.title}
            appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
          />
          <VoteDetails
            colony={colony}
            motionId={motionId}
            buttonComponent={
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={MSG.buttonReveal}
                disabled={!isValid || !hasRegisteredProfile || !values.vote}
                onClick={() => handleSubmit()}
                loading={isSubmitting}
              />
            }
          />
        </div>
      )}
    </ActionForm>
  );
};

RevealWidget.displayName = 'dashboard.ActionsPage.RevealWidget';

export default RevealWidget;
