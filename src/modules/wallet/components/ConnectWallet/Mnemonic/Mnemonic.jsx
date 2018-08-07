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

type Props = {};

type State = {
  isValid: boolean,
};

class Mnemonic extends Component<Props, State> {
  state = { isValid: true };

  render() {
    const { isValid } = this.state;
    return (
      <Fragment>
        <div className={styles.content}>
          <Heading text={MSG.heading} />
          <Textarea
            connect={false}
            label={MSG.instructionText}
            name="connectWalletMnemonic"
          />
          {!isValid && <Heading text={MSG.errorDescription} />}
        </div>
        <div className={styles.actions}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            text={BUTTON_MSG.back}
          />
          <Button
            appearance={{ theme: 'primary' }}
            disabled={!isValid}
            text={BUTTON_MSG.advance}
          />
        </div>
      </Fragment>
    );
  }
}

export default Mnemonic;
