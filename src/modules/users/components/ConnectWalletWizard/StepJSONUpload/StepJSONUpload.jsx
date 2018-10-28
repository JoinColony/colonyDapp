/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardFormikBag } from '~core/Wizard';
import type { FileReaderFile, UploadFile } from '~core/FileUpload';

import Button from '~core/Button';
import Heading from '~core/Heading';
import FileUpload from '~core/FileUpload';
import { Input, FormStatus } from '~core/Fields';

import type { WalletMethod } from '../../../types';

import {
  CHANGE_WALLET,
  SET_CURRENT_USER,
  CHANGE_WALLET_ERROR,
} from '../../../actionTypes';

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
    defaultMessage:
      'Could not unlock your wallet. Please double check your password',
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
  method: WalletMethod,
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
};

const StepJSONUpload = ({ previousStep, isValid, status }: Props) => (
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
  walletJsonFileUpload: yup.array().of(yup.object()),
  walletJsonPassword: yup.string(),
});

export const onSubmit = {
  submit: CHANGE_WALLET,
  success: SET_CURRENT_USER,
  error: CHANGE_WALLET_ERROR,
  onError(_: Object, { setStatus }: WizardFormikBag<FormValues>) {
    setStatus({ error: MSG.errorUnlockWallet });
  },
  // Transform payload because it's ugly
  setPayload(
    action: Object,
    { method, walletJsonFileUpload, walletJsonPassword }: FormValues,
  ) {
    const [file] = walletJsonFileUpload;
    const keystore = file.uploaded;
    return {
      ...action,
      payload: { keystore, method, password: walletJsonPassword },
    };
  },
};

StepJSONUpload.displayName = displayName;

export const Step = StepJSONUpload;
