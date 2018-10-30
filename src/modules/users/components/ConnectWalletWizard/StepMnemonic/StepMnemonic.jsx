/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardFormikBag } from '~core/Wizard';

import {
  WALLET_CHANGE,
  CURRENT_USER_CREATE,
  WALLET_CHANGE_ERROR,
} from '../../../actionTypes';

import { Textarea, FormStatus } from '~core/Fields';
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

type FormValues = {
  connectwalletmnemonic: string,
};

type Props = {
  nextStep: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

const displayName = 'user.ConnectWalletWizard.StepMnemonic';

const StepMnemonic = ({
  previousStep,
  isSubmitting,
  isValid,
  status,
}: Props) => (
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
        onClick={previousStep}
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
);

StepMnemonic.displayName = displayName;

export const validationSchema = yup.object({
  connectwalletmnemonic: yup.string().required(MSG.mnemonicRequired),
});

export const onSubmit = {
  submit: WALLET_CHANGE,
  success: CURRENT_USER_CREATE,
  error: WALLET_CHANGE_ERROR,
  // onSuccess() {},
  onError(_: Object, { setStatus }: WizardFormikBag<FormValues>) {
    setStatus({ error: MSG.errorOpenMnemonic });
  },
};

export const Step = StepMnemonic;
