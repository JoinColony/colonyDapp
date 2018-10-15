/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { MessageDescriptor } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';
import type { UploadFile } from '~core/FileUpload/types';

import { withBoundActionCreators } from '~utils/redux';

import {
  /*
   * Prettier sugests a fix that would break the line length rule.
   * This comment fixes that :)
   */
  openKeystoreWallet as openKeystoreWalletAction,
} from '../../../actionCreators/wallet';

import Button from '~core/Button';
import Heading from '~core/Heading';
import FileUpload from '~core/FileUpload';
import { Input } from '~core/Fields';
import styles from './StepJSONUpload.css';

import keystoreMock from './__datamocks__/wallet-keystore-test.json';

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
  errorDescription: {
    id: 'user.ConnectWalletWizard.StepJSONUpload.errorDescription',
    defaultMessage: 'Oops, wrong file',
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

const StepJSONUpload = ({ previousStep, handleSubmit, isValid }: Props) => (
  <main>
    <div className={styles.content}>
      <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
      <div className={styles.uploadArea}>
        <FileUpload
          accept={['application/json']}
          name="walletJsonFileUpload"
          label={MSG.fileUploadLabel}
          help={MSG.fileUploadHelp}
        />
      </div>
      <Input
        name="walletJsonPassword"
        label={MSG.filePasswordLabel}
        help={MSG.filePasswordHelp}
        type="password"
      />
    </div>
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

const enhance = withBoundActionCreators({ openKeystoreWalletAction });

export const validationSchema = yup.object({
  walletJsonFileUpload: yup.string().required(MSG.errorDescription),
  walletJsonPassword: yup.string(),
});

export const onSubmit: SubmitFn<FormValues> = (
  { walletJsonPassword },
  {
    props: {
      handleDidConnectWallet,
      openKeystoreWalletAction: openKeystoreWallet,
    },
    setErrors,
    setSubmitting,
  },
) =>
  openKeystoreWallet(
    JSON.stringify(keystoreMock),
    walletJsonPassword,
    (message: MessageDescriptor) =>
      setErrors({ walletJsonFileUpload: message }),
    setSubmitting,
    handleDidConnectWallet,
  );

StepJSONUpload.displayName = displayName;

export const Step = enhance(StepJSONUpload);
