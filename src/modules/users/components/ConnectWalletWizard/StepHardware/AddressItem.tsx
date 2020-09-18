import React from 'react';
import { BigNumber } from 'ethers/utils';

import { Address } from '~types/index';
import Radio from '~core/Fields/Radio';
import Numeral from '~core/Numeral';
import styles from './AddressItem.css';

import { DEFAULT_NETWORK_TOKEN, DEFAULT_TOKEN_DECIMALS } from '~constants';

interface Props {
  address: Address;
  checked: boolean;
  balance: BigNumber;
}

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
      <Numeral
        value={balance}
        suffix={` ${DEFAULT_NETWORK_TOKEN.symbol}`}
        unit={DEFAULT_TOKEN_DECIMALS}
      />
    </div>
  </>
);

AddressItem.displayName = displayName;

export default AddressItem;
