import { FormikBag } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { WizardProps } from '~core/Wizard';
import FileUpload, { FileReaderFile, UploadFile } from '~core/FileUpload';
import { WalletSpecificType } from '~immutable/index';

import { pipe, mapPayload, mergePayload } from '~utils/actions';
import Button from '~core/Button';
import Heading from '~core/Heading';

import { ActionForm, Input, FormStatus } from '~core/Fields';
import { ActionTypes } from '~redux/index';

import styles from './StepJSONUpload.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.heading',
    defaultMessage: 'Log in with your JSON file',
  },
  fileUploadLabel: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.fileUploadLabel',
    defaultMessage: 'Select your Wallet File',
  },
  fileUploadHelp: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.fileUploadHelp',
    defaultMessage: '(.json)',
  },
  filePasswordLabel: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.filePasswordLabel',
    defaultMessage: 'Password',
  },
  filePasswordHelp: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.filePasswordHelp',
    defaultMessage: '(Optional)',
  },
  errorKeystore: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.errorKeystore',
    defaultMessage: 'This does not look like a valid keystore',
  },
  errorUnlockWallet: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.errorUnlockWallet',
    defaultMessage:
      'Could not unlock your wallet. Please double check your password',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.buttonAdvance',
    defaultMessage: 'Continue',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepJSONUpload.buttonBack',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  method: WalletSpecificType;
  walletJsonFileUpload: UploadFile[];
  walletJsonPassword: string;
};

const validationSchema = yup.object({
  walletJsonFileUpload: yup.array().of(yup.object()),
  walletJsonPassword: yup.string(),
});

const transformPayload = ({
  walletJsonFileUpload,
  walletJsonPassword,
}: FormValues) => {
  const [file] = walletJsonFileUpload;
  const keystore = file.uploaded;
  return { keystore, password: walletJsonPassword };
};

type Props = WizardProps<FormValues>;

const displayName = 'users.ConnectWalletWizard.StepJSONUpload';

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

const StepJSONUpload = ({
  nextStep,
  resetWizard,
  wizardForm,
  wizardValues,
}: Props) => {
  const transform = useCallback(
    pipe(
      mergePayload(wizardValues),
      mapPayload(transformPayload),
    ),
    [wizardValues],
  );
  return (
    <ActionForm
      submit={ActionTypes.WALLET_CREATE}
      success={ActionTypes.CURRENT_USER_CREATE}
      error={ActionTypes.WALLET_CREATE_ERROR}
      onError={(_: object, { setStatus }: FormikBag<object, FormValues>) => {
        setStatus({ error: MSG.errorUnlockWallet });
      }}
      onSuccess={values => nextStep({ ...values })}
      validationSchema={validationSchema}
      transform={transform}
      {...wizardForm}
    >
      {({ status, isValid }) => (
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
              onClick={resetWizard}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              disabled={!isValid}
              text={MSG.buttonAdvance}
              type="submit"
            />
          </div>
        </main>
      )}
    </ActionForm>
  );
};

StepJSONUpload.displayName = displayName;

export default StepJSONUpload;
