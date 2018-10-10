/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { MessageDescriptor } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';
import { withBoundActionCreators } from '~utils/redux';

import {
  /*
   * Prettier sugests a fix that would break the line length rule.
   * This comment fixes that :)
   */
  openMnemonicWallet as openMnemonicWalletAction,
} from '../../../actionCreators/wallet';

import Textarea from '~core/Fields/Textarea';
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
  handleDidConnectWallet: () => void,
  nextStep: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

const displayName = 'user.ConnectWalletWizard.StepMnemonic';

const StepMnemonic = ({
  handleSubmit,
  previousStep,
  isSubmitting,
  isValid,
}: Props) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.content}>
      <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
      <Textarea label={MSG.instructionText} name="connectwalletmnemonic" />
    </div>
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
  </form>
);

StepMnemonic.displayName = displayName;

export const validationSchema = yup.object({
  connectwalletmnemonic: yup.string().required(MSG.mnemonicRequired),
});

export const onSubmit: SubmitFn<FormValues> = (
  { connectwalletmnemonic },
  { props, setErrors, setSubmitting },
) => {
  const {
    handleDidConnectWallet,
    openMnemonicWalletAction: openMnemonicWallet,
  } = props;
  openMnemonicWallet(
    connectwalletmnemonic,
    (message: MessageDescriptor) =>
      setErrors({ connectwalletmnemonic: message }),
    setSubmitting,
    handleDidConnectWallet,
  );
};

const enhance = withBoundActionCreators({ openMnemonicWalletAction });

export const Step = enhance(StepMnemonic);
