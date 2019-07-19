/* @flow */

import type { FormikBag } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { open } from '@colony/purser-metamask';
import { staticMethods as metamaskMessages } from '@colony/purser-metamask/messages';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { ActionForm } from '~core/Fields';
import WalletInteraction from '~users/GasStation/WalletInteraction';

import { ACTIONS } from '~redux';
import { WALLET_CATEGORIES } from '~immutable';

import styles from './StepMetaMask.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.heading',
    defaultMessage: "You're connected to MetaMask",
  },
  subHeading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'users.ConnectWalletWizard.StepMetaMask.errorHeading',
    defaultMessage: `{metamaskError, select,
      notAuthorized {MetaMask is not authorized to access this domain.}
      cancelSign {Signing of the MetaMask authorization message was cancelled.}
      notAvailable {The MetaMask extension is not available.}
      other {Oops! We were unable to detect MetaMask.}
    }`,
  },
  errorOpenMetamask: {
    id: 'users.ConnectWalletWizard.StepMetaMask.errorOpenMetamask',
    defaultMessage: 'We could not connect to MetaMask',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.advance',
    defaultMessage: 'Continue',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.retry',
    defaultMessage: 'Try Again',
  },
});

type FormValues = {};

type Props = WizardProps<FormValues>;

type State = {
  isLoading: boolean,
  isValid: boolean,
  metamaskError: string | null,
};

class MetaMask extends Component<Props, State> {
  timerHandle: TimeoutID;

  static displayName = 'users.ConnectWalletWizard.StepMetaMask';

  state = {
    isLoading: false,
    isValid: false,
    metamaskError: null,
  };

  componentDidMount() {
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
    const {
      didNotAuthorize,
      cancelMessageSign,
      metamaskNotAvailable,
    } = metamaskMessages;
    let metamaskError = null;
    let wallet;
    try {
      wallet = await open();
    } catch (error) {
      metamaskError = error.message;
      if (error.message.includes(didNotAuthorize)) {
        metamaskError = 'notAuthorized';
      }
      if (error.message.includes(cancelMessageSign)) {
        metamaskError = 'cancelSign';
      }
      if (error.message.includes(metamaskNotAvailable)) {
        metamaskError = 'notAvailable';
      }
    }
    this.setState({
      isValid: !metamaskError || !!(wallet && wallet.ensAddress),
      isLoading: false,
      metamaskError,
    });
  };

  handleRetryClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    /*
     * This is here only to show a spinner on the button after being clicked
     * Without this, the user can't tell if the click actually registered
     */
    this.timerHandle = setTimeout(async () => {
      await this.connectMetaMask();
    }, 500);
  };

  render() {
    const { nextStep, resetWizard, wizardForm, wizardValues } = this.props;
    const { isLoading, isValid, metamaskError } = this.state;
    return (
      <ActionForm
        submit={ACTIONS.WALLET_CREATE}
        success={ACTIONS.CURRENT_USER_CREATE}
        error={ACTIONS.WALLET_CREATE_ERROR}
        onError={(_: string, { setStatus }: FormikBag<Object, FormValues>) => {
          setStatus({ error: MSG.errorOpenMetamask });
        }}
        onSuccess={values => nextStep({ ...values })}
        transform={mergePayload(wizardValues)}
        {...wizardForm}
      >
        {({ isSubmitting, status }) => (
          <main>
            <div className={styles.content}>
              <div className={styles.iconContainer}>
                <Icon
                  name="metamask"
                  title={{ id: 'wallet.metamask' }}
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
                  text={
                    status && status.error ? status.error : MSG.errorHeading
                  }
                  textValues={{ metamaskError }}
                  appearance={{ size: 'medium', margin: 'none' }}
                />
              )}
            </div>
            {isValid && (
              <div className={styles.interactionPrompt}>
                <WalletInteraction walletType={WALLET_CATEGORIES.METAMASK} />
              </div>
            )}
            <div className={styles.actions}>
              <Button
                text={MSG.buttonBack}
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={resetWizard}
              />
              {isValid ? (
                <Button
                  text={MSG.buttonAdvance}
                  appearance={{ theme: 'primary', size: 'large' }}
                  type="submit"
                  loading={isLoading || isSubmitting}
                />
              ) : (
                <Button
                  text={MSG.buttonRetry}
                  appearance={{ theme: 'primary', size: 'large' }}
                  onClick={this.handleRetryClick}
                  loading={isLoading || isSubmitting}
                />
              )}
            </div>
          </main>
        )}
      </ActionForm>
    );
  }
}

export default MetaMask;
