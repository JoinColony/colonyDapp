/* @flow */
import type { FormikBag, FormikErrors, FormikProps } from 'formik';

import { withFormik } from 'formik';
import { compose } from 'recompose';
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { HardwareWallet } from './types';

import asProvider from '../asProvider';
import HardwareChoice from './HardwareChoice.jsx';

import Icon from '../../../../core/components/Icon';
import Input from '../../../../core/components/Fields/Input';
import InputLabel from '../../../../core/components/Fields/InputLabel';
import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import styles from './Hardware.css';

import hardwareWalletChoices from './__mocks__/hardwareWalletMock';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.Hardware.heading',
    defaultMessage: 'We detected a hardware wallet connection.',
  },
  subHeading: {
    id: 'ConnectWallet.providers.Hardware.subHeading',
    defaultMessage: 'Would you like to access colony with that?',
  },
  walletSelectionLabel: {
    id: 'ConnectWallet.providers.Hardware.walletSelectionLabel',
    defaultMessage: 'Select an address',
  },
  searchInputPlacholder: {
    id: 'ConnectWallet.providers.Hardware.searchInputPlaceholder',
    defaultMessage: 'Search...',
  },
  balanceText: {
    id: 'ConnectWallet.providers.Hardware.balanceText',
    defaultMessage: 'Balance',
  },
  emptySearchResultsText: {
    id: 'ConnectWallet.providers.Hardware.emptySearchResultsText',
    defaultMessage: `Your search didn't return any connected wallets.`,
  },
  errorHeading: {
    id: 'ConnectWallet.providers.Hardware.errorHeading',
    defaultMessage: `Oops, we couldn't find your hardware wallet`,
  },
  errorDescription: {
    id: 'ConnectWallet.providers.Hardware.errorDescription',
    defaultMessage:
      'Please check that your hardware wallet is connected and try again.',
  },
  walletChoiceRequired: {
    id: 'ConnectWallet.providers.Hardware.walletChoiceRequired',
    defaultMessage: 'Please select one of the wallets below.',
  },
  buttonAdvance: {
    id: 'ConnectWallet.providers.Hardware.button.advance',
    defaultMessage: 'Unlock Wallet',
  },
  buttonBack: {
    id: 'ConnectWallet.providers.Hardware.button.back',
    defaultMessage: 'Choose a different wallet',
  },
  buttonRetry: {
    id: 'ConnectWallet.providers.Hardware.button.retry',
    defaultMessage: 'Try Again',
  },
});

type FormValues = {
  hardwareWalletChoice: string,
  hardwareWalletFilter: string,
};

type Props = FormikProps<FormValues> & {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  walletChoices: Array<HardwareWallet>,
};

class Hardware extends Component<Props, State> {
  state = {
    walletChoices: [],
  };

  componentDidMount() {
    this.getWalletChoices();
  }

  getWalletChoices = () => {
    this.setState({
      walletChoices: hardwareWalletChoices,
    });
  };

  render() {
    const { walletChoices } = this.state;
    const {
      handleExit,
      handleSubmit,
      isSubmitting,
      isValid,
      values: { hardwareWalletChoice, hardwareWalletFilter },
    } = this.props;

    const filteredWalletChoices = walletChoices.filter(wallet =>
      wallet.address.includes(hardwareWalletFilter),
    );

    const iconClassName = hardwareWalletFilter
      ? styles.searchBoxIconContainerActive
      : styles.searchBoxIconContainer;

    return (
      <form onSubmit={handleSubmit}>
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
            {filteredWalletChoices.map(wallet => (
              <div className={styles.choiceRow} key={wallet.address}>
                <HardwareChoice
                  wallet={wallet}
                  checked={hardwareWalletChoice === wallet.address}
                  searchTerm={hardwareWalletFilter}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            text={MSG.buttonBack}
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={handleExit}
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
      </form>
    );
  }
}

const enhance = compose(
  asProvider(),
  withFormik({
    mapPropsToValues: () => ({
      hardwareWalletChoice: '',
      hardwareWalletFilter: '',
    }),
    validate: (values: FormValues): FormikErrors<FormValues> => {
      const errors = {};
      if (!values.hardwareWalletChoice) {
        errors.hardwareWalletChoice = MSG.walletChoiceRequired;
      }
      return errors;
    },
    handleSubmit: (values: FormValues, otherProps: FormikBag<Object, *>) => {
      const {
        props: { handleDidConnectWallet },
      } = otherProps;
      handleDidConnectWallet();
    },
  }),
);

export default enhance(Hardware);
