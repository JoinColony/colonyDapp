/* @flow */
import type { Element } from 'react';

import { Formik } from 'formik';
import React, { Component, createElement, Fragment } from 'react';
import { defineMessages, FormattedNumber } from 'react-intl';

import Icon from '../../../../core/components/Icon';
import Input from '../../../../core/components/Fields/Input';
import Radio from '../../../../core/components/Fields/Radio';
import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import HardwareIcon from '../../../../../img/icons/wallet.svg';
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
    defaultMessage: "Oops, we couldn't find your hardware wallet",
  },
  errorDescription: {
    id: 'ConnectWallet.providers.Hardware.errorDescription',
    defaultMessage:
      'Please check that your hardware wallet is connected and try again.',
  },
  buttonAdvance: {
    id: 'ConnectWallet.providers.Hardware.button.advance',
    defaultMessage: 'Go to Colony',
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

type Props = {
  handleDidConnectWallet: () => void,
  handleExit: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

type State = {
  isValid: boolean,
  searchQuery: string,
  walletChoices: Array<Object>,
};

class Hardware extends Component<Props, State> {
  state = {
    isValid: true,
    walletChoices: [],
    searchQuery: '',
  };

  componentDidMount() {
    this.getWalletChoices();
  }

  handleSubmit = values => {
    console.log(values);
  };

  renderWalletAddress = (walletAddress: string): Element<*> => {
    const firstChunkSize = 5;
    const lastChunkSize = 5;
    const middleChunkSize =
      walletAddress.length - firstChunkSize - lastChunkSize;
    const middleChunkEnd = firstChunkSize + middleChunkSize;
    const addressParts = [
      walletAddress.slice(0, firstChunkSize),
      walletAddress.slice(firstChunkSize, middleChunkEnd),
      walletAddress.slice(middleChunkEnd, walletAddress.length),
    ].map((part, idx) =>
      createElement(
        'span',
        { className: styles.addressPart, key: `${idx}-${part}` },
        part,
      ),
    );
    return <label className={styles.walletChoiceAddress}>{addressParts}</label>;
  };

  getWalletChoices = () => {
    this.setState({
      walletChoices: hardwareWalletChoices,
    });
  };

  handleChangeSearchQuery = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      searchQuery: evt.currentTarget.value,
    });
  };

  renderActionButton = () => {
    const { isValid } = this.state;
    const actionButtonProps = {
      text: isValid ? MSG.buttonAdvance : MSG.buttonRetry,
      appearance: { theme: 'primary' },
    };
    return <Button {...actionButtonProps} />;
  };

  render() {
    const { isValid, searchQuery, walletChoices } = this.state;
    const { handleExit } = this.props;

    const filteredWalletChoices = walletChoices.filter(wallet =>
      wallet.address.includes(searchQuery),
    );

    return (
      <Fragment>
        <div className={styles.content}>
          <div className={styles.headingContainer}>
            {isValid ? (
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
                <div className={styles.choiceHeadingRow}>
                  <div className={styles.searchBox}>
                    <div className={styles.searchBoxIconContainer}>
                      <Icon name="wallet" title="hardware wallet" />
                    </div>
                    <Input
                      appearance={{ colorSchema: 'transparent' }}
                      connect={false}
                      name="hardwareWalletFilter"
                      onChange={this.handleChangeSearchQuery}
                      label={MSG.walletSelectionLabel}
                      placeholder={MSG.searchInputPlacholder}
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
              <Fragment>
                <HardwareIcon />
                <Heading text={MSG.errorHeading} />
                <Heading text={MSG.errorDescription} />
              </Fragment>
            )}
          </div>
          <div className={styles.walletChoicesContainer}>
            {/* TODO put real radio field here */}
            {filteredWalletChoices.length === 0 &&
              searchQuery.length > 0 && (
                <Heading text={MSG.emptySearchResultsText} />
              )}
            <Formik
              initialValues={{
                hardwareWalletChoice: '',
              }}
              onSubmit={this.handleSubmit}
              render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  {filteredWalletChoices.map(wallet => (
                    <div className={styles.choiceRow} key={wallet.address}>
                      <div className={styles.choiceInputContainer}>
                        <Radio
                          checked={
                            values.hardwareWalletChoice === wallet.address
                          }
                          name="hardwareWalletChoice"
                          value={wallet.address}
                          elementOnly
                        >
                          {this.renderWalletAddress(wallet.address)}
                        </Radio>
                      </div>
                      {/* <div className={styles.choiceLabelContainer}>
                        {this.renderWalletAddress(wallet.address)}
                      </div> */}
                      <div className={styles.choiceBalanceContainer}>
                        <FormattedNumber
                          value={wallet.balance}
                          style="currency" // eslint-disable-line
                          currency="ETH"
                          currencyDisplay="name"
                        />
                      </div>
                    </div>
                  ))}
                </form>
              )}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            text={MSG.buttonBack}
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            onClick={handleExit}
          />
          {this.renderActionButton()}
        </div>
      </Fragment>
    );
  }
}

export default Hardware;
