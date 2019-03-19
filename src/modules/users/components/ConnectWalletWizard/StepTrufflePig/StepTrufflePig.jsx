/* @flow */

import type { FormikBag } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import compose from 'lodash/fp/compose';

import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { ActionForm, Select } from '~core/Fields';
import { ACTIONS } from '~redux';
import styles from './StepTrufflePig.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.heading',
    defaultMessage: "You're connected using a TrufflePig account",
  },
  subHeading: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.subHeading',
    defaultMessage: 'Would you like to access Colony with that?',
  },
  errorHeading: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.errorHeading',
    defaultMessage: "Oops we couldn't load from TrufflePig",
  },
  errorOpenTrufflepig: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.errorOpenTrufflepig',
    defaultMessage: 'We could not connect to TrufflePig',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.button.advance',
    defaultMessage: 'Go to Colony',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.button.back',
    defaultMessage: 'Back',
  },
  buttonRetry: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.button.retry',
    defaultMessage: 'Try Again',
  },
  accountIndex: {
    id: 'users.ConnectWalletWizard.StepTrufflePig.select.accountIndex',
    defaultMessage: 'Account index',
  },
});

type FormValues = {};

type Props = WizardProps<FormValues>;

type State = {
  isLoading: boolean,
  isValid: boolean,
  accountIndex: number,
};

// TODO provide some means in Trufflepig to get information for these accounts
// (at the moment we are assuming that 10 addresses are available).
// Waiting on PR: colonyJS#319
const accountIndexOptions = Array.from({ length: 10 }).map((_, value) => ({
  value,
  label: {
    id: `${MSG.accountIndex.id}.${value}`,
    defaultMessage: `${value}`,
  },
}));

class StepTrufflePig extends Component<Props, State> {
  timerHandle: TimeoutID;

  static displayName = 'users.ConnectWalletWizard.StepTrufflePig';

  state = {
    isLoading: false,
    isValid: false,
    accountIndex: 0,
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
    const { accountIndex } = this.state;
    let trufflepigError = null;
    try {
      const loader = new TrufflepigLoader();
      await loader.getAccount(accountIndex);
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
    this.reconnectTrufflePig();
  };

  reconnectTrufflePig = () => {
    this.setState({ isLoading: true });
    // add a short timeout to show the loading spinner so the user knows there's something processing
    this.timerHandle = setTimeout(async () => {
      await this.connectTrufflePig();
    }, 500);
  };

  setAccountIndex = (_: string, accountIndex: number) => {
    this.setState({ accountIndex });
    this.reconnectTrufflePig();
  };

  render() {
    const {
      previousStep,
      wizardForm,
      formHelpers: { includeWizardValues },
    } = this.props;
    const { isLoading, isValid, accountIndex } = this.state;
    const transform = compose(
      includeWizardValues,
      mergePayload({ accountIndex }),
    )();
    return (
      <ActionForm
        submit={ACTIONS.WALLET_CREATE}
        success={ACTIONS.CURRENT_USER_CREATE}
        error={ACTIONS.WALLET_CREATE_ERROR}
        onError={(
          errorMessage: string,
          { setStatus }: FormikBag<Object, FormValues>,
        ) => {
          setStatus({ error: MSG.errorOpenTrufflepig });
        }}
        transform={transform}
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
                    appearance={{ size: 'medium' }}
                  />
                  <Select
                    $value={accountIndex}
                    form={{ setFieldValue: this.setAccountIndex }}
                    label={MSG.accountIndex}
                    name="accountIndex"
                    options={accountIndexOptions}
                    data-test="trufflepigAccountSelector"
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
