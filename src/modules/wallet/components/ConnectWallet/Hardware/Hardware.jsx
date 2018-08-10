/* @flow */

import React, { Component, createElement, Fragment } from 'react';
import { defineMessages, FormattedNumber } from 'react-intl';

import type { Element } from 'react';
import type { MessageDescriptor } from 'react-intl';

import Input from '../../../../core/components/Fields/Input';
import Button from '../../../../core/components/Button';
import Heading from '../../../../core/components/Heading';
import HardwareIcon from '../../../../../img/icons/wallet.svg';
import styles from './Hardware.css';

import hardwareWalletChoices from './__mocks__/hardwareWalletMock';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWallet.providers.Hardware.heading',
    defaultMessage: 'Which wallet would you like to use to access Colony?',
  },
  instructionText: {
    id: 'ConnectWallet.providers.Hardware.instructionText',
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
    return <p>{addressParts}</p>;
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
                <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
                <Heading
                  text={MSG.instructionText}
                  appearance={{ size: 'small' }}
                />
                <div className={styles.choiceHeadingRow}>
                  <div>
                    <Input
                      connect={false}
                      name="hardwareWalletFilter"
                      onChange={this.handleChangeSearchQuery}
                      placeholder={MSG.searchInputPlacholder}
                    />
                  </div>
                  <div>
                    <Heading
                      text={MSG.balanceText}
                      appearance={{ size: 'small' }}
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
            {filteredWalletChoices.map(wallet => (
              <div className={styles.choiceRow} key={wallet.address}>
                <div className={styles.choiceInputContainer}>
                  <input
                    name="hardwareWalletChoice"
                    type="radio"
                    value={wallet.value}
                  />
                </div>
                <div className={styles.choiceLabelContainer}>
                  {this.renderWalletAddress(wallet.address)}
                </div>
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
