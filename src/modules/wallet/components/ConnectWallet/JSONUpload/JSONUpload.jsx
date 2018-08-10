/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import { Formik } from 'formik';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import FileUpload from '../../../../core/components/Fields/FileUpload';
import styles from './JSONUpload.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.JSONUpload.heading',
    defaultMessage: 'Upload your .json wallet file to access Colony',
  },
  instructionText: {
    id: 'ConnectWallet.providers.JSONUpload.instructionText',
    defaultMessage: 'Select your Wallet File (.json)',
  },
  errorDescription: {
    id: 'ConnectWallet.providers.JSONUpload.errorDescription',
    defaultMessage: 'Oops, wrong file',
  },
  buttonAdvance: {
    id: 'ConnectWallet.providers.JSONUpload.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'ConnectWallet.providers.JSONUpload.button.back',
    defaultMessage: 'Back',
  },
  buttonRemove: {
    id: 'ConnectWallet.providers.JSONUpload.button.remove',
    defaultMessage: 'Remove',
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

  render() {
    const { hasFile, isValid } = this.state;
    const { handleExit } = this.props;

    const canAdvance: boolean = hasFile && isValid;

    return (
      <Fragment>
        <div className={styles.content}>
          <Heading text={MSG.heading} />
          <Heading text={MSG.instructionText} />
          {/* drop zone goes here */}
          <Formik
            onsubmit={(values) => alert(values)}
            render={() => (
              <FileUpload
                accept={['application/json']}
                name="walletJsonFileUpload"
              />
            )}
          />
          {!isValid && <Heading text={MSG.errorDescription} />}
        </div>
        <div className={styles.actions}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            text={MSG.buttonBack}
            onClick={handleExit}
          />
          <Button
            appearance={{ theme: 'primary' }}
            disabled={!canAdvance}
            text={MSG.buttonAdvance}
          />
        </div>
      </Fragment>
    );
  }
}

export default JSONUpload;
