/* @flow */
import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { Formik } from 'formik';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import FileUpload from '../../../../core/components/FileUpload';
import Input from '../../../../core/components/Fields/Input';
import styles from './JSONUpload.css';

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

type Props = {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  hasFile: boolean,
  isValid: boolean,
};

class JSONUpload extends Component<Props, State> {
  state = {
    hasFile: false,
    isValid: true,
  };

  handleSubmit = (values: Object) => {
    const { handleDidConnectWallet } = this.props;
    console.log(values);
    handleDidConnectWallet();
  };

  render() {
    const { hasFile, isValid } = this.state;
    const { handleExit } = this.props;

    const canAdvance: boolean = hasFile && isValid;

    return (
      <Formik
        onSubmit={this.handleSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.content}>
              <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
              {/* drop zone goes here */}
              <FileUpload
                accept={['application/json']}
                name="walletJsonFileUpload"
                label={MSG.fileUploadLabel}
                help={MSG.fileUploadHelp}
              />
              <Input
                name="walletJsonPassword"
                label={MSG.filePasswordLabel}
                help={MSG.filePasswordHelp}
                type="password"
              />
              {!isValid && (
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
                disabled={!canAdvance}
                text={MSG.buttonAdvance}
                type="submit"
              />
            </div>
          </form>
        )}
      />
    );
  }
}

export default JSONUpload;
