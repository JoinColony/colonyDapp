/* @flow */

import type { FormikBag } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import {
  WALLET_CREATE,
  CURRENT_USER_CREATE,
  WALLET_CREATE_ERROR,
} from '../../../actionTypes';

import { ActionForm, Textarea, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepMnemonic.css';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepMnemonic.heading',
    defaultMessage: 'Access Colony with your Mnemonic Phrase',
  },
  instructionText: {
    id: 'user.ConnectWalletWizard.StepMnemonic.instructionText',
    defaultMessage: 'Your Mnemonic Phrase',
  },
  errorDescription: {
    id: 'user.ConnectWalletWizard.StepMnemonic.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
  errorOpenMnemonic: {
    id: 'user.ConnectWalletWizard.StepMnemonic.errorOpenMnemonic',
    defaultMessage:
      'Oops, there is something wrong. Check the format of your mnemonic',
  },
  mnemonicRequired: {
    id: 'user.ConnectWalletWizard.StepMnemonic.mnemonicRequired',
    defaultMessage: 'You must provide a mnemonic phrase.',
  },
  buttonAdvanceText: {
    id: 'user.ConnectWalletWizard.StepMnemonic.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBackText: {
    id: 'user.ConnectWalletWizard.StepMnemonic.button.back',
    defaultMessage: 'Back',
  },
});

const validationSchema = yup.object({
  connectwalletmnemonic: yup.string().required(MSG.mnemonicRequired),
});

type FormValues = {
  connectwalletmnemonic: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'user.ConnectWalletWizard.StepMnemonic';

const StepMnemonic = ({
  previousStep,
  formHelpers: { includeWizardValues },
  wizardForm,
}: Props) => (
  <ActionForm
    submit={WALLET_CREATE}
    success={CURRENT_USER_CREATE}
    error={WALLET_CREATE_ERROR}
    onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) => {
      setStatus({ error: MSG.errorOpenMnemonic });
    }}
    validationSchema={validationSchema}
    setPayload={includeWizardValues}
    {...wizardForm}
  >
    {({ isSubmitting, isValid, status, values }) => (
      <main>
        <div className={styles.content}>
          <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
          <Textarea label={MSG.instructionText} name="connectwalletmnemonic" />
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

StepMnemonic.displayName = displayName;

export default StepMnemonic;
