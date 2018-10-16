/* @flow */

import type { FormikProps } from 'formik';
import * as yup from 'yup';

import { compose } from 'recompose';
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import ledgerWallet from '@colony/purser-ledger';

import type { SubmitFn, WizardFormikBag } from '~core/Wizard';

import withContext from '~context/withContext';
import { withBoundActionCreators } from '~utils/redux';
import HardwareChoice from './HardwareChoice.jsx';

import {
  OPEN_HARDWARE_WALLET,
  WALLET_SET,
  WALLET_SET_ERROR,
} from '../../../actionTypes';

import Icon from '~core/Icon';
import { Input, InputLabel, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepHardware.css';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepHardware.heading',
    defaultMessage: 'We detected a hardware wallet connection.',
  },
  subHeading: {
    id: 'user.ConnectWalletWizard.StepHardware.subHeading',
    defaultMessage: 'Would you like to access colony with that?',
  },
  walletSelectionLabel: {
    id: 'user.ConnectWalletWizard.StepHardware.walletSelectionLabel',
    defaultMessage: 'Select an address',
  },
  searchInputPlacholder: {
    id: 'user.ConnectWalletWizard.StepHardware.searchInputPlaceholder',
    defaultMessage: 'Search...',
  },
  balanceText: {
    id: 'user.ConnectWalletWizard.StepHardware.balanceText',
    defaultMessage: 'Balance',
  },
  emptySearchResultsText: {
    id: 'user.ConnectWalletWizard.StepHardware.emptySearchResultsText',
    defaultMessage: `Your search didn't return any connected wallets.`,
  },
  errorHeading: {
    id: 'user.ConnectWalletWizard.StepHardware.errorHeading',
    defaultMessage: `Oops, we couldn't find your hardware wallet`,
  },
  errorDescription: {
    id: 'user.ConnectWalletWizard.StepHardware.errorDescription',
    defaultMessage:
      'Please check that your hardware wallet is connected and try again.',
  },
  errorPickAddress: {
    id: 'user.ConnectWalletWizard.StepHardware.errorPickAddress',
    defaultMessage:
      'Something went wrong. That is probably not your fault!',
    },
  walletChoiceRequired: {
    id: 'user.ConnectWalletWizard.StepHardware.walletChoiceRequired',
    defaultMessage: 'Please select one of the wallets below.',
  },
  buttonAdvance: {
    id: 'user.ConnectWalletWizard.StepHardware.button.advance',
    defaultMessage: 'Unlock Wallet',
  },
  buttonBack: {
    id: 'user.ConnectWalletWizard.StepHardware.button.back',
    defaultMessage: 'Choose a different wallet',
  },
  buttonRetry: {
    id: 'user.ConnectWalletWizard.StepHardware.button.retry',
    defaultMessage: 'Try Again',
  },
});

type FormValues = {
  hardwareWalletChoice: string,
  hardwareWalletFilter: string,
};

type Props = FormikProps<FormValues> & {
  context: Object,
  handleDidConnectWallet: () => void,
  previousStep: () => void,
  nextStep: () => void,
};

type State = {
  walletChoices: Array<string>,
};

class StepHardware extends Component<Props, State> {
  static displayName = 'user.ConnectWalletWizard.StepHardware';

  state = {
    walletChoices: [],
  };

  componentDidMount() {
    this.getWalletChoices();
  }

  // TODO: try to move the handling to sagas and get data from redux store
  getWalletChoices = async () => {
    const {
      context: { currentWallet },
    } = this.props;
    /*
     * If that fails, we try to open the Ledger wallet
     *
     * @NOTE If both wallets are available, ledger will overwrite trezor
     *
     * @TODO Our dev environment needs to run on HTTPS for this to work
     */
    try {
      const ledgerWalletInstance = await ledgerWallet.open({
        addressCount: 100,
      });
      currentWallet.setNewWallet(ledgerWalletInstance);
      return this.setState({
        walletChoices: ledgerWalletInstance.otherAddresses,
      });
    } catch (caughtError) {
      console.log(caughtError);
      /*
       * We fail silently
       */
    }
    return false;
  };

  render() {
    const { walletChoices } = this.state;
    const {
      handleSubmit,
      isSubmitting,
      isValid,
      previousStep,
      status,
      values: { hardwareWalletChoice = '', hardwareWalletFilter = '' },
    } = this.props;

    const filteredWalletChoices = walletChoices.filter(address =>
      address.includes(hardwareWalletFilter),
    );

    const iconClassName = hardwareWalletFilter
      ? styles.searchBoxIconContainerActive
      : styles.searchBoxIconContainer;

    return (
      <main>
        <div className={styles.content}>
          <div className={styles.headingContainer}>
            {walletChoices.length > 0 ? (
              <Fragment>
                <Heading
                  text={MSG.heading}
                  appearance={{
                    size: 'medium',
                    margin: 'none',
                    weight: 'thin',
                  }}
                />
                <Heading
                  text={MSG.subHeading}
                  appearance={{ size: 'medium', weight: 'thin' }}
                />
                <InputLabel label={MSG.walletSelectionLabel} />
                <div className={styles.choiceHeadingRow}>
                  <div className={styles.searchBox}>
                    <div className={iconClassName}>
                      <Icon name="wallet" title="hardware wallet" />
                    </div>
                    <Input
                      appearance={{ theme: 'minimal' }}
                      name="hardwareWalletFilter"
                      label={MSG.walletSelectionLabel}
                      placeholder={MSG.searchInputPlacholder}
                      elementOnly
                    />
                  </div>
                  <div>
                    <Heading
                      text={MSG.balanceText}
                      appearance={{ size: 'normal' }}
                    />
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className={styles.noWalletFound}>
                <Icon name="wallet" title="hardware wallet" />
                <Heading
                  text={MSG.errorHeading}
                  appearance={{ size: 'large' }}
                />
                <Heading
                  text={MSG.errorDescription}
                  appearance={{ size: 'normal' }}
                />
              </div>
            )}
          </div>
          <div className={styles.walletChoicesContainer}>
            {filteredWalletChoices.length === 0 &&
              hardwareWalletFilter.length > 0 && (
                <Heading
                  text={MSG.emptySearchResultsText}
                  appearance={{ size: 'normal' }}
                />
              )}
            {filteredWalletChoices.map(address => (
              <div className={styles.choiceRow} key={address}>
                <HardwareChoice
                  wallet={address}
                  checked={hardwareWalletChoice === address}
                  searchTerm={hardwareWalletFilter}
                />
              </div>
            ))}
          </div>
        </div>
        <FormStatus status={status} />
        <div className={styles.actions}>
          <Button
            text={MSG.buttonBack}
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={previousStep}
          />
          <Button
            text={
              walletChoices.length > 0 ? MSG.buttonAdvance : MSG.buttonRetry
            }
            appearance={{ theme: 'primary', size: 'large' }}
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
          />
        </div>
      </main>
    );
  }
}

const enhance = compose(
  withContext,
);

export const onSubmit = {
  submit: OPEN_HARDWARE_WALLET,
  success: WALLET_SET,
  error: WALLET_SET_ERROR,
  // onSuccess() {},
  onError(_: Object, { setStatus }: WizardFormikBag<FormValues>) {
    setStatus({ error: MSG.errorPickAddress });
  },
};

export const validationSchema = yup.object({
  hardwareWalletChoice: yup
    .string()
    .address()
    .required(MSG.walletChoiceRequired),
});

export const Step = enhance(StepHardware);
