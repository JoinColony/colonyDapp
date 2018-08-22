/* @flow */
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { ProviderType } from 'colony-wallet/flowtypes';

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
  buttonAdvance: {
    id: 'ConnectWallet.providers.MetaMask.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'ConnectWallet.providers.MetaMask.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'ConnectWallet.providers.MetaMask.button.retry',
    defaultMessage: 'Try Again',
  },
});

type Props = {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  isLoading: boolean,
  isValid: boolean,
};

class MetaMask extends Component<Props, State> {
  state = {
    isLoading: false,
    isValid: false,
  };

  componentDidMount() {
    this.connectMetaMask();
  }

  connectMetaMask = () => {
    const provider: ProviderType = metamask();
    this.setState({
      isValid: !!provider.ensAddress,
    });
  };

  handleRetryClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    this.connectMetaMask();
  };

  handleUseConnectedWallet = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { handleDidConnectWallet } = this.props;
    evt.preventDefault();
    this.setState({ isLoading: true });
    // TODO save wallet connection details here
    handleDidConnectWallet();
  };

  render() {
    const { handleExit } = this.props;
    const { isLoading, isValid } = this.state;
    return (
      <Fragment>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <Icon
              name="metamask"
              title="metamask"
              appearance={{ size: 'medium' }}
            />
          </div>
          {isValid ? (
            <Fragment>
              <Heading
                text={MSG.heading}
                appearance={{ size: 'medium', margin: 'none' }}
              />
              <Heading
                text={MSG.subHeading}
                appearance={{ size: 'medium', margin: 'none' }}
              />
            </Fragment>
          ) : (
            <Heading
              text={MSG.errorHeading}
              appearance={{ size: 'medium', margin: 'none' }}
            />
          )}
        </div>
        <div className={styles.actions}>
          <Button
            text={MSG.buttonBack}
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={handleExit}
          />
          {isValid ? (
            <Button
              text={MSG.buttonAdvance}
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={this.handleUseConnectedWallet}
              loading={isLoading}
            />
          ) : (
            <Button
              text={MSG.buttonRetry}
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={this.handleRetryClick}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default MetaMask;
