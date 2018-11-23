/* @flow */

import type { FormikBag } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import type { WizardProps } from '~core/Wizard';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { ActionForm } from '~core/Fields';
import styles from './StepTrufflePig.css';

import {
  WALLET_CREATE,
  CURRENT_USER_CREATE,
  WALLET_CREATE_ERROR,
} from '../../../actionTypes';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.heading',
    defaultMessage: "You're connected using a TrufflePig account",
  },
  subHeading: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.errorHeading',
    defaultMessage: "Oops we couldn't load from TrufflePig",
  },
  errorOpenTrufflepig: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.errorOpenTrufflepig',
    defaultMessage: 'We could not connect to TrufflePig',
  },
  buttonAdvance: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'user.ConnectWalletWizard.StepTrufflePig.button.retry',
    defaultMessage: 'Try Again',
  },
});

type FormValues = {};

type Props = WizardProps<FormValues>;

type State = {
  isLoading: boolean,
  isValid: boolean,
};

class StepTrufflePig extends Component<Props, State> {
  timerHandle: TimeoutID;

  static displayName = 'user.ConnectWalletWizard.StepTrufflePig';

  state = {
    isLoading: false,
    isValid: false,
  };

  componentDidMount() {
    this.connectTrufflePig();
  }

  componentWilUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  connectTrufflePig = async () => {
    let trufflepigError = null;
    try {
      const loader = new TrufflepigLoader();
      await loader.getAccount(0);
    } catch (error) {
      trufflepigError = error;
    }
    this.setState({
      isValid: !trufflepigError,
      isLoading: false,
    });
  };

  handleRetryClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    // add a short timeout to show the loading spinner so the user knows there's something processing
    this.timerHandle = setTimeout(async () => {
      await this.connectTrufflePig();
    }, 500);
  };

  render() {
    const {
      previousStep,
      wizardForm,
      formHelpers: { includeWizardValues },
    } = this.props;
    const { isLoading, isValid } = this.state;
    return (
      <ActionForm
        submit={WALLET_CREATE}
        success={CURRENT_USER_CREATE}
        error={WALLET_CREATE_ERROR}
        onError={(
          errorMessage: string,
          { setStatus }: FormikBag<Object, FormValues>,
        ) => {
          setStatus({ error: MSG.errorOpenTrufflepig });
        }}
        setPayload={includeWizardValues}
        {...wizardForm}
      >
        {({ status, isSubmitting, values }) => (
          <main>
            <div className={styles.content}>
              <div className={styles.iconContainer}>
                <Icon
                  name="wallet"
                  title="wallet"
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

export default StepTrufflePig;
