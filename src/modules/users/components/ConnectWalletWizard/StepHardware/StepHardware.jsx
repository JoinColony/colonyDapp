/* @flow */

import type { FormikBag } from 'formik';

import * as yup from 'yup';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';
import type { Address } from '~types';

import { ACTIONS } from '~redux';
import { mergePayload } from '~utils/actions';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import { ActionForm, Input, InputLabel, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import styles from './StepHardware.css';

import { fetchAccounts as fetchAccountsAction } from '../../../actionCreators';
import AddressItem from './AddressItem.jsx';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepHardware.heading',
    defaultMessage:
      'We found a hardware wallet! Which address would you like to use?',
  },
  walletSelectionLabel: {
    id: 'users.ConnectWalletWizard.StepHardware.walletSelectionLabel',
    defaultMessage: 'Select an address',
  },
  walletIconTitle: {
    id: 'users.ConnectWalletWizard.StepHardware.walletIconTitle',
    defaultMessage: 'Hardware wallet',
  },
  searchInputPlacholder: {
    id: 'users.ConnectWalletWizard.StepHardware.searchInputPlaceholder',
    defaultMessage: 'Search...',
  },
  balanceText: {
    id: 'users.ConnectWalletWizard.StepHardware.balanceText',
    defaultMessage: 'Balance',
  },
  emptySearchResultsText: {
    id: 'users.ConnectWalletWizard.StepHardware.emptySearchResultsText',
    defaultMessage: `Your search didn't return any connected wallets.`,
  },
  errorHeading: {
    id: 'users.ConnectWalletWizard.StepHardware.errorHeading',
    defaultMessage: `Oops, we couldn't find your hardware wallet`,
  },
  errorDescription: {
    id: 'users.ConnectWalletWizard.StepHardware.errorDescription',
    defaultMessage:
      'Please check that your hardware wallet is connected and try again.',
  },
  errorPickAddress: {
    id: 'users.ConnectWalletWizard.StepHardware.errorPickAddress',
    defaultMessage: 'Something went wrong. That is probably not your fault!',
  },
  walletChoiceRequired: {
    id: 'users.ConnectWalletWizard.StepHardware.walletChoiceRequired',
    defaultMessage: 'Please select one of the wallets below.',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonAdvance',
    defaultMessage: 'Unlock Wallet',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonBack',
    defaultMessage: 'Choose a different wallet',
  },
  buttonRetry: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonRetry',
    defaultMessage: 'Try Again',
  },
  loadingAddresses: {
    id: 'users.ConnectWalletWizard.StepHardware.loadingAddresses',
    defaultMessage: 'Loading available addresses...',
  },
});

const validationSchema = yup.object({
  hardwareWalletChoice: yup
    .string()
    .address()
    .required(MSG.walletChoiceRequired),
});

type FormValues = {
  method: 'ledger' | 'trezor',
  hardwareWalletChoice: string,
  hardwareWalletFilter: string,
};

type Props = WizardProps<FormValues> & {
  fetchAccounts: typeof fetchAccountsAction,
  isLoading: boolean,
  availableAddresses: Address[],
};

class StepHardware extends Component<Props> {
  static displayName = 'users.ConnectWalletWizard.StepHardware';

  static defaultProps = {
    availableAddresses: [],
  };

  componentDidMount() {
    const {
      fetchAccounts,
      wizardValues: { method },
    } = this.props;
    fetchAccounts(method);
  }

  renderContent(formValues: FormValues) {
    const { availableAddresses, isLoading } = this.props;
    const { hardwareWalletChoice = '', hardwareWalletFilter = '' } = formValues;

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
      nextStep,
      availableAddresses,
      previousStep,
      wizardForm,
      wizardValues,
    } = this.props;
    return (
      <ActionForm
        submit={ACTIONS.WALLET_CREATE}
        success={ACTIONS.CURRENT_USER_CREATE}
        error={ACTIONS.WALLET_CREATE_ERROR}
        onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) =>
          setStatus({ error: MSG.errorPickAddress })
        }
        onSuccess={values => nextStep({ ...values })}
        validationSchema={validationSchema}
        transform={mergePayload(wizardValues)}
        {...wizardForm}
      >
        {({ isSubmitting, isValid, status, values }) => (
          <div>
            <section className={styles.content}>
              {this.renderContent(values)}
            </section>
            <FormStatus status={status} />
            <div className={styles.actions}>
              <Button
                text={MSG.buttonBack}
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={() => previousStep(values)}
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
        )}
      </ActionForm>
    );
  }
}

const enhance = connect(
  ({ user }) => ({
    isLoading: user.wallet.loading,
    availableAddresses: user.wallet.availableAddresses,
  }),
  { fetchAccounts: fetchAccountsAction },
);

export default enhance(StepHardware);
