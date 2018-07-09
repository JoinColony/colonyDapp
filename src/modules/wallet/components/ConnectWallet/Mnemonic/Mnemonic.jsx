/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import Textarea from '../../../../core/components/Fields/Textarea';
import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import styles from './Mnemonic.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.Mnemonic.heading',
    defaultMessage: 'Access Colony with your Mnemonic Phrase',
  },
  instructionText: {
    id: 'ConnectWallet.providers.Mnemonic.instructionText',
    defaultMessage: 'Your Mnemonic Phrase',
  },
  errorDescription: {
    id: 'ConnectWallet.providers.Mnemonic.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
});

const BUTTON_MSG = defineMessages({
  advance: {
    id: 'ConnectWallet.providers.Mnemonic.button.advance',
    defaultMessage: 'Go to Colony',
  },
  back: {
    id: 'ConnectWallet.providers.Mnemonic.button.back',
    defaultMessage: 'Back',
  },
});

type Props = {}

type State = {
  isValid: boolean,
} 

class Mnemonic extends Component<Props, State> {
  
  state = { 
    isValid: true,
  }

  render() {
    return (
      <Fragment>
        <div className={styles.content}>
          <Heading text={MSG.heading} />
          <Textarea 
            error={MSG.errorDescription}
            hasError={true}
            label={MSG.instructionText} 
            name="connect_wallet_mnemonic" 
          />
          {!this.state.isValid &&
            <Heading text={MSG.errorDescription} />
          }
        </div>
        <div className={styles.actions}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }} 
            value={BUTTON_MSG.back} 
          />
          <Button 
            appearance={{ theme: 'primary' }}
            disabled={!this.state.isValid} 
            value={BUTTON_MSG.advance}
          />
        </div>
      </Fragment>
    )
  }
}

export const reduxFormOpts = {
  form: 'connect_wallet',
};

export default Mnemonic;
