/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { open } from '@colony/purser-metamask';

import { withBoundActionCreators } from '~utils/redux';

import type { SubmitFn } from '~core/Wizard';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import styles from './StepMetaMask.css';

import {
  /*
   * Prettier sugests a fix that would break the line length rule.
   * This comment fixes that :)
   */
  openMetamaskWallet as openMetamaskWalletAction,
} from '../../../actionCreators/wallet';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepMetaMask.heading',
    defaultMessage: "You're connected to MetaMask",
  },
  subHeading: {
    id: 'user.ConnectWalletWizard.StepMetaMask.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'user.ConnectWalletWizard.StepMetaMask.errorHeading',
    defaultMessage: "Oops we couldn't detect MetaMask",
  },
  buttonAdvance: {
    id: 'user.ConnectWalletWizard.StepMetaMask.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'user.ConnectWalletWizard.StepMetaMask.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'user.ConnectWalletWizard.StepMetaMask.button.retry',
    defaultMessage: 'Try Again',
  },
});

type FormValues = {};

type Props = {
  previousStep: () => void,
  nextStep: () => void,
  handleDidConnectWallet: () => void,
  openMetamaskWalletAction: (*) => void,
} & FormikProps<FormValues>;

type State = {
  isLoading: boolean,
  isValid: boolean,
};

class MetaMask extends Component<Props, State> {
  timerHandle: TimeoutID;

  static displayName = 'user.ConnectWalletWizard.StepMetaMask';

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
    /*
     * @TODO Detect metamask wallet state for better errors
     * This should actually use `detect()` to check which metamask error this is
     * and show the user a specific messages (locked, disabled, no account, etc)
     */
    try {
      // const provider: ProviderType = metamask();
      wallet = await open();
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
    const {
      handleDidConnectWallet,
      openMetamaskWalletAction: openMetamaskWallet,
    } = this.props;
    evt.preventDefault();
    this.setState({ isLoading: true });
    return openMetamaskWallet(handleDidConnectWallet);
  };

  render() {
    const { previousStep } = this.props;
    const { isLoading, isValid } = this.state;
    return (
      <main>
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
            onClick={previousStep}
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
      </main>
    );
  }
}

const enhance = withBoundActionCreators({ openMetamaskWalletAction });

export const Step = enhance(MetaMask);

// TODO: Maybe we would like to use this for something
export const onSubmit: SubmitFn<FormValues> = () => {};
