/* @flow */

import React, { Component, Fragment } from 'react';
import BigNumber from 'bn.js';

import type { Address } from '~types';

import Radio from '~core/Fields/Radio';
import SpinnerLoader from '~core/Preloaders/SpinnerLoader.jsx';
import Numeral from '~core/Numeral';

import styles from './AddressItem.css';

type Props = {|
  address: Address,
  checked: boolean,
  fetchAddressBalance: string => BigNumber,
|};

type State = {|
  isLoading: boolean,
  balance: BigNumber,
|};

class AddressItem extends Component<Props, State> {
  state = {
    isLoading: true,
    balance: new BigNumber(0),
  };

  componentDidMount() {
    this.getWalletBalance();
  }

  getWalletBalance = async () => {
    const { address, fetchAddressBalance } = this.props;
    const balance = await fetchAddressBalance(address);
    return this.setState({ balance, isLoading: false });
  };

  render() {
    const { isLoading, balance } = this.state;
    const { address, checked } = this.props;
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
            <Numeral value={balance} suffix=" ETH" unit={18} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default AddressItem;
