/* @flow */
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import metamask from '@colony/purser-metamask';

import asProvider from '../asProvider';

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
  timerHandle: TimeoutID;

  state = {
    isLoading: false,
    isValid: false,
  };

  componentDidMount() {
    // TODO
    this.connectMetaMask()
      .then()
      .catch();
  }

  componentWilUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  connectMetaMask = async () => {
    // TODO should this throw an error?
    let metamaskError = null;
    let wallet;
    try {
      // const provider: ProviderType = metamask();
      wallet = await metamask.open();
    } catch (error) {
      metamaskError = error;
    }
    this.setState({
      isValid: !metamaskError || !!(wallet && wallet.ensAddress),
      isLoading: false,
    });
  };

  handleRetryClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    // add a short timeout to show the loading spinner so the user knows there's something processing
    this.timerHandle = setTimeout(async () => {
      await this.connectMetaMask();
    }, 500);
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
      <div>
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
              loading={isLoading}
            />
          )}
        </div>
      </div>
    );
  }
}

export default asProvider()(MetaMask);
