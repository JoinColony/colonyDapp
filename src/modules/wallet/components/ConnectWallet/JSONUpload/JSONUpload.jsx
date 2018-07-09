/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
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
  }
});

type Props = {}

type State = {
  hasFile: boolean,
  isValid: boolean,
} 

class JSONUpload extends Component<Props, State> {
  
  state = { 
    hasFile: false, 
    isValid: true,
  }

  render() {

    const canAdvance: boolean = this.state.hasFile && this.state.isValid;

    return (
      <Fragment>
        <div className={styles.content}>
          <Heading text={MSG.heading} />
          <Heading text={MSG.instructionText} />
          {/* drop zone goes here */}
          {!this.state.isValid &&
            <Heading text={MSG.errorDescription} />
          }
        </div>
        <div className={styles.actions}>
          <Button 
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }} 
            value={MSG.buttonBack} 
          />
          <Button 
            appearance={{ theme: 'primary' }}
            disabled={!canAdvance} 
            value={MSG.buttonAdvance}
          />
        </div>
      </Fragment>
    )
  }
}

export default JSONUpload;