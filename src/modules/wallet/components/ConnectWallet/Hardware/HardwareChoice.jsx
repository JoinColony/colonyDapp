/* @flow */
import type { Node } from 'react';

import React, { Component, Fragment } from 'react';

import { FormattedNumber } from 'react-intl';

import type { HardwareWallet } from './types';

import styles from './HardwareChoice.css';

import Radio from '../../../../core/components/Fields/Radio';
import SpinnerLoader from '../../../../core/components/Preloaders/SpinnerLoader.jsx'; // eslint-disable-line max-len

type Props = {
  checked: boolean,
  renderWalletAddress: (address: string) => Node,
  wallet: HardwareWallet,
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

  render() {
    const { isLoading } = this.state;
    const { wallet, checked, renderWalletAddress } = this.props;

    const formattedNumberProps = {
      value: wallet.balance,
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
            value={wallet.address}
            elementOnly
          >
            {renderWalletAddress(wallet.address)}
          </Radio>
        </div>
        <div className={styles.choiceBalanceContainer}>
          {isLoading ? (
            <SpinnerLoader appearance={{ size: 'small', theme: 'primary' }} />
          ) : (
            <FormattedNumber {...formattedNumberProps} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default HardwareChoice;
