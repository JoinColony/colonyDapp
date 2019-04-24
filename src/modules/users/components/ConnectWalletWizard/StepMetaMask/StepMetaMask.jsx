/* @flow */

import type { FormikBag } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { open } from '@colony/purser-metamask';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { ActionForm } from '~core/Fields';
import { ACTIONS } from '~redux';
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
    defaultMessage: "Oops we couldn't detect MetaMask",
  },
  errorOpenMetamask: {
    id: 'users.ConnectWalletWizard.StepMetaMask.errorOpenMetamask',
    defaultMessage: 'We could not connect to MetaMask',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepMetaMask.button.advance',
    defaultMessage: 'Go to Colony',
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
};

class MetaMask extends Component<Props, State> {
  timerHandle: TimeoutID;

  static displayName = 'users.ConnectWalletWizard.StepMetaMask';

  state = {
    isLoading: false,
    isValid: false,
  };

  componentDidMount() {
    /**
     * @todo Improve error modes for creating the metamask connection
     */
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
    // Should this throw an error?
    let metamaskError = null;
    let wallet;
    /**
     * @todo Detect metamask wallet state for better errors
     * @body This should actually use `detect()` to check which metamask error this is
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

  render() {
    const { nextStep, previousStep, wizardForm, wizardValues } = this.props;
    const { isLoading, isValid } = this.state;
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
        {({ isSubmitting, status, values }) => (
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
                  text={
                    status && status.error ? status.error : MSG.errorHeading
                  }
                  appearance={{ size: 'medium', margin: 'none' }}
                />
              )}
            </div>
            <div className={styles.actions}>
              <Button
                text={MSG.buttonBack}
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() => previousStep(values)}
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
