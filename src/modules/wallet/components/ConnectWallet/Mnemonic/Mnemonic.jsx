/* @flow */
import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { Formik } from 'formik';

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

type Props = {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  isValid: boolean,
};

class Mnemonic extends Component<Props, State> {
  state = { isValid: true };

  handleSubmit = (values: Object) => {
    const mnemonic = values.connectwalletmnemonic;
    this.handleWalletConnect(mnemonic);
  };

  handleWalletConnect = (mnemonicPhrase: string) => {
    const { handleDidConnectWallet } = this.props;
    console.log(mnemonicPhrase);
    handleDidConnectWallet();
  };

  render() {
    const { isValid } = this.state;
    const { handleExit } = this.props;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.content}>
              <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
              <Textarea
                label={MSG.instructionText}
                name="connectwalletmnemonic"
              />
              {!isValid && <Heading text={MSG.errorDescription} />}
            </div>
            <div className={styles.actions}>
              <Button
                appearance={{ theme: 'secondary' }}
                text={BUTTON_MSG.back}
                onClick={handleExit}
              />
              <Button
                appearance={{ theme: 'primary' }}
                disabled={!isValid}
                text={BUTTON_MSG.advance}
                type="submit"
              />
            </div>
          </form>
        )}
      />
    );
  }
}

export default Mnemonic;
