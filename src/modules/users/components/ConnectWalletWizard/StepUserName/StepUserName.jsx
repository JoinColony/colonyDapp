/* @flow */

import type { FormikBag } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import {
  USERNAME_CREATE,
  USERNAME_CREATE_SUCCESS,
  USERNAME_CREATE_ERROR,
} from '../../../actionTypes';

import { ActionForm, Input, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepUserName.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepUserName.heading',
    defaultMessage: `Congrats, your wallet is set up.
      Let's finish your account!`,
  },
  instructionText: {
    id: 'users.ConnectWalletWizard.StepUserName.instructionText',
    defaultMessage: 'Add a name so people can identify you within Colony.',
  },
  label: {
    id: 'users.ConnectWalletWizard.StepUserName.label',
    defaultMessage: 'Your Name',
  },
  errorDescription: {
    id: 'users.ConnectWalletWizard.StepUserName.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
  errorUsername: {
    id: 'users.ConnectWalletWizard.StepUserName.errorOpenMnemonic',
    defaultMessage:
      'Oops, there is something wrong. Check the format of your username',
  },
  usernameRequired: {
    id: 'users.ConnectWalletWizard.StepUserName.usernameRequired',
    defaultMessage: 'You must provide a username.',
  },
  buttonAdvanceText: {
    id: 'users.ConnectWalletWizard.StepUserName.button.advance',
    defaultMessage: 'Launch App',
  },
  buttonBackText: {
    id: 'users.ConnectWalletWizard.StepUserName.button.back',
    defaultMessage: 'Back',
  },
});

const validationSchema = yup.object({
  username: yup.string().required(MSG.usernameRequired),
});

type FormValues = {
  username: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'users.ConnectWalletWizard.StepUserName';

const StepUserName = ({
  previousStep,
  formHelpers: { includeWizardValues },
  wizardForm,
}: Props) => (
  <ActionForm
    submit={USERNAME_CREATE}
    success={USERNAME_CREATE_SUCCESS}
    error={USERNAME_CREATE_ERROR}
    onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) => {
      setStatus({ error: MSG.errorUsername });
    }}
    validationSchema={validationSchema}
    setPayload={includeWizardValues}
    {...wizardForm}
  >
    {({ isSubmitting, isValid, status, values }) => (
      <main>
        <div className={styles.content}>
          <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
          <div className={styles.marginTop}>
            <FormattedMessage {...MSG.instructionText} />
          </div>
          <div className={styles.marginTop}>
            <Input label={MSG.label} name="username" />
          </div>
        </div>
        <FormStatus status={status} />
        <div className={styles.actions}>
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            text={MSG.buttonBackText}
            onClick={() => previousStep(values)}
          />
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            disabled={!isValid}
            text={MSG.buttonAdvanceText}
            type="submit"
            loading={isSubmitting}
          />
        </div>
      </main>
    )}
  </ActionForm>
);

StepUserName.displayName = displayName;

export default StepUserName;
