/* @flow */

import type { FormikProps } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { WizardFormikBag } from '~core/Wizard';

import { SpinnerLoader } from '~core/Preloaders';

import { fetchAccounts as fetchAccountsAction } from '../../../actionCreators';

import AddressItem from './AddressItem.jsx';

import {
  WALLET_CHANGE,
  CURRENT_USER_CREATE,
  WALLET_CHANGE_ERROR,
} from '../../../actionTypes';

import Icon from '~core/Icon';
import { Input, InputLabel, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepHardware.css';

const MSG = defineMessages({
  heading: {
    id: 'user.ConnectWalletWizard.StepHardware.heading',
    defaultMessage:
      'We found a hardware wallet! Which address would you like to use?',
  },
  walletSelectionLabel: {
    id: 'user.ConnectWalletWizard.StepHardware.walletSelectionLabel',
    defaultMessage: 'Select an address',
  },
  walletIconTitle: {
    id: 'user.ConnectWalletWizard.StepHardware.walletIconTitle',
    defaultMessage: 'Hardware wallet',
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
    defaultMessage: 'Something went wrong. That is probably not your fault!',
  },
  walletChoiceRequired: {
    id: 'user.ConnectWalletWizard.StepHardware.walletChoiceRequired',
    defaultMessage: 'Please select one of the wallets below.',
  },
  buttonAdvance: {
    id: 'user.ConnectWalletWizard.StepHardware.buttonAdvance',
    defaultMessage: 'Unlock Wallet',
  },
  buttonBack: {
    id: 'user.ConnectWalletWizard.StepHardware.buttonBack',
    defaultMessage: 'Choose a different wallet',
  },
  buttonRetry: {
    id: 'user.ConnectWalletWizard.StepHardware.buttonRetry',
    defaultMessage: 'Try Again',
  },
  loadingAddresses: {
    id: 'user.ConnectWalletWizard.StepHardware.loadingAddresses',
    defaultMessage: 'Loading available addresses...',
  },
});

type FormValues = {
  method: 'ledger' | 'trezor',
  hardwareWalletChoice: string,
  hardwareWalletFilter: string,
};

type Props = FormikProps<FormValues> & {
  // TODO: How do we want to type actionCreators in the future to avoid duplication?
  // We could export the types from the actionCreator file itself?
  fetchAccounts: (
    method: $PropertyType<FormValues, 'method'>,
  ) => { type: string },
  isLoading: boolean,
  availableAddresses: string[],
  previousStep: () => void,
  nextStep: () => void,
};

class StepHardware extends Component<Props> {
  static displayName = 'user.ConnectWalletWizard.StepHardware';

  static defaultProps = {
    availableAddresses: [],
  };

  componentDidMount() {
    const {
      fetchAccounts,
      values: { method },
    } = this.props;
    fetchAccounts(method);
  }

  renderContent() {
    const {
      availableAddresses,
      isLoading,
      values: { hardwareWalletChoice = '', hardwareWalletFilter = '' },
    } = this.props;

    if (isLoading) {
      return (
        <SpinnerLoader
          loadingText={MSG.loadingAddresses}
          appearance={{ size: 'massive' }}
        />
      );
    }

    if (availableAddresses.length) {
      const filteredWalletChoices = availableAddresses.filter(address =>
        address.includes(hardwareWalletFilter),
      );

      const iconClassName = hardwareWalletFilter
        ? styles.searchBoxIconContainerActive
        : styles.searchBoxIconContainer;

      return (
        <Fragment>
          <Heading
            text={MSG.heading}
            appearance={{ size: 'medium', weight: 'thin' }}
          />
          <InputLabel label={MSG.walletSelectionLabel} />
          <div className={styles.choiceHeadingRow}>
            <div className={styles.searchBox}>
              <div className={iconClassName}>
                <Icon name="wallet" title={MSG.walletIconTitle} />
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
              <Heading text={MSG.balanceText} appearance={{ size: 'normal' }} />
            </div>
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
                <AddressItem
                  address={address}
                  checked={hardwareWalletChoice === address}
                  searchTerm={hardwareWalletFilter}
                />
              </div>
            ))}
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Icon name="wallet" title={MSG.walletIconTitle} />
        <Heading text={MSG.errorHeading} appearance={{ size: 'large' }} />
        <Heading text={MSG.errorDescription} appearance={{ size: 'normal' }} />
      </Fragment>
    );
  }

  render() {
    const {
      availableAddresses,
      isSubmitting,
      isValid,
      previousStep,
      status,
    } = this.props;

    return (
      <div>
        <section className={styles.content}>{this.renderContent()}</section>
        <FormStatus status={status} />
        <div className={styles.actions}>
          <Button
            text={MSG.buttonBack}
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={previousStep}
          />
          <Button
            text={
              availableAddresses.length > 0
                ? MSG.buttonAdvance
                : MSG.buttonRetry
            }
            appearance={{ theme: 'primary', size: 'large' }}
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
          />
        </div>
      </div>
    );
  }
}

export const onSubmit = {
  submit: WALLET_CHANGE,
  success: CURRENT_USER_CREATE,
  error: WALLET_CHANGE_ERROR,
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

const enhance = connect(
  ({ user }) => ({
    isLoading: user.wallet.loading,
    availableAddresses: user.wallet.availableAddresses,
  }),
  { fetchAccounts: fetchAccountsAction },
);

export const Step = enhance(StepHardware);
