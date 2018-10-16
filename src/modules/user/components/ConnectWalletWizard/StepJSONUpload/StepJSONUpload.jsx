/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { MessageDescriptor } from 'react-intl';

import type { SubmitFn, WizardFormikBag } from '~core/Wizard';
import type { FileReaderFile, UploadFile } from '~core/FileUpload';

import { withBoundActionCreators } from '~utils/redux';

import {
  OPEN_KEYSTORE_WALLET,
  WALLET_SET,
  WALLET_SET_ERROR,
} from '../../../actionTypes';

import Button from '~core/Button';
import Heading from '~core/Heading';
import FileUpload from '~core/FileUpload';
import { Input, FormStatus } from '~core/Fields';
import styles from './StepJSONUpload.css';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.heading',
    defaultMessage: 'Log in with your JSON file',
  },
  fileUploadLabel: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.fileUploadLabel',
    defaultMessage: 'Select your Wallet File',
  },
  fileUploadHelp: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.fileUploadHelp',
    defaultMessage: '.json',
  },
  filePasswordLabel: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.filePasswordLabel',
    defaultMessage: 'Password',
  },
  filePasswordHelp: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.filePasswordHelp',
    defaultMessage: 'Optional',
  },
  errorKeystore: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.errorKeystore',
    defaultMessage: 'This does not look like a valid keystore',
  },
  errorUnlockWallet: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.errorUnlockWallet',
    defaultMessage: 'Could not unlock your wallet. Please double check your password',
  },
  buttonAdvance: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.buttonAdvance',
    defaultMessage: 'Unlock your wallet',
  },
  buttonBack: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.buttonBack',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  walletJsonFileUpload: Array<UploadFile>,
  walletJsonPassword: string,
};

type Props = {
  handleDidConnectWallet: () => void,
  nextStep: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

const displayName = 'user.ConnectWalletWizard.StepJSONUpload';

const readKeystoreFromFileData = (file: FileReaderFile) => {
  if (!file || !file.data) {
    throw new Error('No file data received');
  }
  const base64Str = file.data.split('base64,').pop();
  let keystore;
  try {
    keystore = atob(base64Str);
  } catch (e) {
    throw new Error('Could not parse keystore data');
  }
  return keystore;
}

const StepJSONUpload = ({ previousStep, handleSubmit, isValid, status }: Props) => (
  <main>
    <div className={styles.content}>
      <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
      <div className={styles.uploadArea}>
        <FileUpload
          accept={['application/json']}
          name="walletJsonFileUpload"
          label={MSG.fileUploadLabel}
          help={MSG.fileUploadHelp}
          upload={readKeystoreFromFileData}
        />
      </div>
      <Input
        name="walletJsonPassword"
        label={MSG.filePasswordLabel}
        help={MSG.filePasswordHelp}
        type="password"
      />
    </div>
    <FormStatus status={status} />
    <div className={styles.actions}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        text={MSG.buttonBack}
        onClick={previousStep}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        disabled={!isValid}
        text={MSG.buttonAdvance}
        type="submit"
      />
    </div>
  </main>
);

export const validationSchema = yup.object({
  // FIXME: try to validate this
  // walletJsonFileUpload: yup.object({
  //   address: yup.string().required(),
  //   version: yup.number().required(),
  // }).required(MSG.errorKeystore),
  walletJsonPassword: yup.string(),
});

export const onSubmit = {
  submit: OPEN_KEYSTORE_WALLET,
  success: WALLET_SET,
  error: WALLET_SET_ERROR,
  // onSuccess() {},
  onError(_: Object, { setStatus }: WizardFormikBag<FormValues>) {
    setStatus({ error: MSG.errorUnlockWallet });
  },
  // Transform payload because it's ugly
  setPayload(action: Object, { walletJsonFileUpload, walletJsonPassword }: FormValues) {
    const [file] = walletJsonFileUpload;
    const keystore = file.uploaded;
    return { ...action, payload: { keystore, password: walletJsonPassword } };
  }
};

StepJSONUpload.displayName = displayName;

export const Step = StepJSONUpload;
