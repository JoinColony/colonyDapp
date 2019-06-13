/* @flow */

import React, { Component, Fragment } from 'react';

import { FormattedNumber } from 'react-intl';

import styles from './AddressItem.css';

import Radio from '~core/Fields/Radio';
import SpinnerLoader from '~core/Preloaders/SpinnerLoader.jsx';

import type { Address } from '~types';

type Props = {|
  address: Address,
  checked: boolean,
  searchTerm: string,
|};

type State = {|
  isLoading: boolean,
|};

class AddressItem extends Component<Props, State> {
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
    // @todo Fetch hardware wallet balance or remove timeout
    // @body The timeout here seems to be just "simulating" the fetch
    const timeout = Math.floor(Math.random() * Math.floor(5)) * 1000 + 1000;
    this.timerHandle = setTimeout(() => {
      this.setState({ isLoading: false });
    }, timeout);
  };

  render() {
    const { isLoading } = this.state;
    const { address, checked } = this.props;

    const formattedNumberProps = {
      value: 0,
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
            {address}
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

export default AddressItem;
