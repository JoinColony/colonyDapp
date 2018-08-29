/* @flow */
import React, { Component, Fragment } from 'react';

import { FormattedNumber } from 'react-intl';

import type { HardwareWallet } from './types';

import styles from './HardwareChoice.css';

import Radio from '../../../../core/components/Fields/Radio';
import SpinnerLoader from '../../../../core/components/Preloaders/SpinnerLoader.jsx'; // eslint-disable-line max-len

type Props = {
  checked: boolean,
  wallet: HardwareWallet,
  searchTerm: string,
};

type State = {
  isLoading: boolean,
};

class HardwareChoice extends Component<Props, State> {
  timerHandle: TimeoutID; // for mocking balance lookup, so can clearTimeout in `componentWillUnmount`

  state = {
    isLoading: true,
  };

  componentDidMount() {
    this.getWalletBalance();
  }

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  getWalletBalance = () => {
    const timeout = Math.floor(Math.random() * Math.floor(5)) * 1000 + 1000;
    this.timerHandle = setTimeout(() => {
      this.setState({ isLoading: false });
    }, timeout);
  };

  addressCharacter = (
    character: string,
    idx: number,
    remainingVals: Array<string>,
  ) => {
    const itemKey = `${character}-${remainingVals.join('')}-${idx}`;

    return (
      <span className={styles.addressPart} key={itemKey}>
        {character}
      </span>
    );
  };

  render() {
    const { isLoading } = this.state;
    const {
      checked,
      searchTerm,
      wallet: { address, balance },
    } = this.props;

    const formattedNumberProps = {
      value: balance,
      style: 'currency',
      maximumFractionDigits: 18,
      currency: 'ETH',
      currencyDisplay: 'name',
    };

    return (
      <Fragment>
        <div className={styles.choiceInputContainer}>
          <Radio
            checked={checked}
            name="hardwareWalletChoice"
            value={address}
            elementOnly
          >
            <span className={styles.walletAddressContainer}>
              {searchTerm ? (
                <Fragment>
                  {address.split(searchTerm).reduce((prev, current, idx) => {
                    if (!idx) {
                      return [current.split('').map(this.addressCharacter)];
                    }
                    return prev.concat(
                      <mark
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${searchTerm}-${idx}`}
                        className={styles.highlight}
                      >
                        {searchTerm.split('').map(this.addressCharacter)}
                      </mark>,
                      current.split('').map(this.addressCharacter),
                    );
                  }, [])}
                </Fragment>
              ) : (
                address.split('').map(this.addressCharacter)
              )}
            </span>
          </Radio>
        </div>
        <div className={styles.choiceBalanceContainer}>
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'medium', theme: 'primary' }} />
          ) : (
            <FormattedNumber {...formattedNumberProps} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default HardwareChoice;
