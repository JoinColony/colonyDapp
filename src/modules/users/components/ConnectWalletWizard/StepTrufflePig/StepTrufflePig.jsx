/* @flow */

import type { FormikBag } from 'formik';

// $FlowFixMe
import React, { useState, useEffect, useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import type { WizardProps } from '~core/Wizard';

import { log } from '~utils/debug';
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

/**
 * @todo Get information for Trufflepig accounts.
 * @body Provide some means in Trufflepig to get information for these accounts (at the moment we are assuming that 10 addresses are available). Waiting on PR: colonyJS#319
 */
const accountIndexOptions = Array.from({ length: 10 }).map((_, value) => ({
  value,
  label: {
    id: `${MSG.accountIndex.id}.${value}`,
    defaultMessage: `${value}`,
  },
}));

const displayName = 'users.ConnectWalletWizard.StepTrufflePig';

const StepTrufflePig = ({ previousStep, wizardForm, wizardValues }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [accountIndex, setAccountIndex] = useState(0);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(
    () => {
      const connectTrufflepig = async () => {
        setIsLoading(true);
        try {
          const loader = new TrufflepigLoader();
          await loader.getAccount(accountIndex);
          setIsValid(true);
        } catch (caughtError) {
          /*
           * Since this is a dev-only loader, logging the error is enough.
           */
          log(caughtError);
          setIsValid(false);
        }
        setIsLoading(false);
      };
      connectTrufflepig();
    },
    /*
     * Reconnect to Trufflepig whenever the account index or retry
     * attempts change
     */
    [accountIndex, retryAttempts],
  );

  const handleRetryClick = useCallback(
    () => (event: SyntheticEvent<*>) => {
      event.preventDefault();
      setRetryAttempts(retryAttempts + 1);
    },
    [retryAttempts],
  );

  const transform = useCallback(
    mergePayload({ ...wizardValues, accountIndex }),
    [wizardValues, accountIndex],
  );

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
              <>
                <Heading
                  text={MSG.heading}
                  appearance={{ size: 'medium', margin: 'none' }}
                />
                <Heading
                  text={MSG.subHeading}
                  appearance={{ size: 'medium' }}
                />
                <Select
                  $value={Number(accountIndex)}
                  form={{
                    setFieldValue: (key: string, value: number) =>
                      setAccountIndex(value),
                  }}
                  label={MSG.accountIndex}
                  name="accountIndex"
                  options={accountIndexOptions}
                  data-test="trufflepigAccountSelector"
                />
              </>
            ) : (
              <Heading
                text={status && status.error ? status.error : MSG.errorHeading}
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
                onClick={handleRetryClick}
                loading={isLoading || isSubmitting}
              />
            )}
          </div>
        </main>
      )}
    </ActionForm>
  );
};

StepTrufflePig.displayName = displayName;

export default StepTrufflePig;
