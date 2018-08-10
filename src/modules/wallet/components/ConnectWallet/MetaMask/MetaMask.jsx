/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { metamask } from 'colony-wallet/providers';

import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import Icon from '../../../../core/components/Icon';
import styles from './MetaMask.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.MetaMask.heading',
    defaultMessage: "You're connected to MetaMask",
  },
  subHeading: {
    id: 'ConnectWallet.providers.MetaMask.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'ConnectWallet.providers.MetaMask.errorHeading',
    defaultMessage: "Oops we couldn't detect MetaMask",
  },
});

const BUTTON_MSG = defineMessages({
  advance: {
    id: 'ConnectWallet.providers.MetaMask.button.advance',
    defaultMessage: 'Go to Colony',
  },
  back: {
    id: 'ConnectWallet.providers.MetaMask.button.back',
    defaultMessage: 'Back',
  },
  retry: {
    id: 'ConnectWallet.providers.MetaMask.button.retry',
    defaultMessage: 'Try Again',
  },
});

type Props = {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  isValid: boolean,
};

type MetaMaskResponse = {
  chainId: number,
  ensAddress: String,
  name: String,
  testnet: boolean,
  url: String,
};

class MetaMask extends Component<Props, State> {
  state = {
    isValid: false,
  };

  componentDidMount() {
    this.connectMetaMask();
  }

  connectMetaMask = () => {
    const provider: MetaMaskResponse = metamask();
    this.setState({
      isValid: !!provider.chainId,
    });
  };

  handleRetryClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    this.connectMetaMask();
  };

  handleUseConnectedWallet = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { handleDidConnectWallet } = this.props;
    evt.preventDefault();
    // TODO save wallet connection details here
    handleDidConnectWallet();
  };

  render() {
    const { handleExit } = this.props;
    const { isValid } = this.state;
    return (
      <Fragment>
        <div className={styles.content}>
          <Icon name="metamask" title="metamask" />
          {isValid ? (
            <Fragment>
              <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
              <Heading text={MSG.subHeading} appearance={{ size: 'medium' }} />
            </Fragment>
          ) : (
            <Heading text={MSG.errorHeading} appearance={{ size: 'medium' }} />
          )}
        </div>
        <div className={styles.actions}>
          <Button
            text={BUTTON_MSG.back}
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            onClick={handleExit}
          />
          {isValid ? (
            <Button
              text={BUTTON_MSG.advance}
              appearance={{ theme: 'primary' }}
              onClick={this.handleUseConnectedWallet}
            />
          ) : (
            <Button
              text={BUTTON_MSG.retry}
              appearance={{ theme: 'primary' }}
              onClick={this.handleRetryClick}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default MetaMask;
