/* @flow */

/* eslint-disable-next-line no-unused-vars */
import type { FormikBag, FormikErrors, FormikProps } from 'formik';

import React from 'react';
import { compose } from 'recompose';
import { defineMessages } from 'react-intl';
import { withFormik } from 'formik';

import type { MessageDescriptor } from 'react-intl';

import asProvider from '../asProvider';
import { withBoundActionCreators } from '~utils/redux';

import type { UploadFile } from '../../../../core/components/FileUpload/types';

import {
  /*
   * Prettier sugests a fix that would break the line length rule.
   * This comment fixes that :)
   */
  openKeystoreWallet as openKeystoreWalletAction,
} from '../../../actionCreators/wallet';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import FileUpload from '../../../../core/components/FileUpload';
import Input from '../../../../core/components/Fields/Input';
import styles from './JSONUpload.css';

import keystoreMock from './__datamocks__/wallet-keystore-test.json';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.JSONUpload.heading',
    defaultMessage: 'Log in with your JSON file',
  },
  fileUploadLabel: {
    id: 'ConnectWallet.providers.JSONUpload.fileUploadLabel',
    defaultMessage: 'Select your Wallet File',
  },
  fileUploadHelp: {
    id: 'ConnectWallet.providers.JSONUpload.fileUploadHelp',
    defaultMessage: '.json',
  },
  filePasswordLabel: {
    id: 'ConnectWallet.providers.JSONUpload.filePasswordLabel',
    defaultMessage: 'Password',
  },
  filePasswordHelp: {
    id: 'ConnectWallet.providers.JSONUpload.filePasswordHelp',
    defaultMessage: 'Optional',
  },
  errorDescription: {
    id: 'ConnectWallet.providers.JSONUpload.errorDescription',
    defaultMessage: 'Oops, wrong file',
  },
  buttonAdvance: {
    id: 'ConnectWallet.providers.JSONUpload.buttonAdvance',
    defaultMessage: 'Unlock your wallet',
  },
  buttonBack: {
    id: 'ConnectWallet.providers.JSONUpload.buttonBack',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  walletJsonFileUpload: Array<UploadFile>,
  walletJsonPassword: string,
};

type Props = FormikProps<FormValues> & {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

const JSONUpload = ({ handleExit, handleSubmit, isValid, values }: Props) => (
  <form onSubmit={handleSubmit}>
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
      {!isValid &&
        values.walletJsonFileUpload.length > 0 && (
          <Heading
            text={MSG.errorDescription}
            appearance={{ size: 'medium' }}
          />
        )}
    </div>
    <div className={styles.actions}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        text={MSG.buttonBack}
        onClick={handleExit}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        disabled={!isValid}
        text={MSG.buttonAdvance}
        type="submit"
      />
    </div>
  </form>
);

const enhance = compose(
  asProvider(),
  withBoundActionCreators({ openKeystoreWalletAction }),
  withFormik({
    mapPropsToValues: () => ({
      walletJsonFileUpload: [],
      walletJsonPassword: '',
    }),
    /*
     * @NOTE Re-enable when FileUpload had been fixed
     */
    // validate: (values: FormValues): FormikErrors<FormValues> => {
    //   const errors = {};
    //   if (values.walletJsonFileUpload.length === 0) {
    //     errors.walletJsonFileUpload = MSG.errorDescription;
    //   }
    //   return errors;
    // },
    handleSubmit: (values: FormValues, otherProps: FormikBag<Object, *>) => {
      const { walletJsonPassword } = values;
      const {
        setErrors,
        setSubmitting,
        props: {
          handleDidConnectWallet,
          openKeystoreWalletAction: openKeystoreWallet,
        },
      } = otherProps;
      return openKeystoreWallet(
        JSON.stringify(keystoreMock),
        walletJsonPassword,
        (message: MessageDescriptor) =>
          setErrors({ walletJsonFileUpload: message }),
        setSubmitting,
        handleDidConnectWallet,
      );
    },
  }),
);

export default enhance(JSONUpload);
