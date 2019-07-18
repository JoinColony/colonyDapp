/* @flow */

import React from 'react';
import BigNumber from 'bn.js';

import type { Address } from '~types';

import Radio from '~core/Fields/Radio';
import Numeral from '~core/Numeral';

import styles from './AddressItem.css';

type Props = {|
  address: Address,
  checked: boolean,
  balance: BigNumber,
|};

const displayName = 'users.ConnectWalletWizard.AddressItem';

const AddressItem = ({ address, checked, balance }: Props) => (
  <>
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
      <Numeral value={balance} suffix=" ETH" unit={18} />
    </div>
  </>
);

AddressItem.displayName = displayName;

export default AddressItem;
