/* @flow */
import type { Node } from 'react';

import React, { Component, Fragment } from 'react';

import { FormattedNumber } from 'react-intl';

import styles from './HardwareChoice.css';

import Radio from '../../../../core/components/Fields/Radio';
import SpinnerLoader from '../../../../core/components/Preloaders/SpinnerLoader.jsx';

type Props = {
  checked: boolean,
  renderWalletAddress: (address: string) => Node,
  wallet: Object,
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
    const timeout = Math.floor(Math.random() * Math.floor(5)) * 1000;
    this.timerHandle = setTimeout(() => {
      this.setState({ isLoading: false });
    }, timeout);
  };

  render() {
    const { isLoading } = this.state;
    const { wallet, checked, renderWalletAddress } = this.props;
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
            <FormattedNumber
              value={wallet.balance}
              style="currency" // eslint-disable-line
              maximumFractionDigits={18}
              currency="ETH"
              currencyDisplay="name"
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default HardwareChoice;
