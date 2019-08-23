import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { splitAddress, AddressElements } from '~utils/strings';

import { Address } from '~types/index';

import styles from './MaskedAddress.css';

const MSG = defineMessages({
  wrongAddressFormat: {
    id: 'MaskedAddress.wrongAddressFormat',
    defaultMessage: 'Address format is wrong!',
  },
});

interface Props {
  /*
   * The address to be masked by the helper util
   */
  address: Address;

  /*
   * String pattern to use when masking the address
   */
  mask?: string;
}

const MaskedAddress = ({ address, mask = '...' }: Props) => {
  const cutAddress: AddressElements | Error = splitAddress(address);
  if (cutAddress instanceof Error) {
    return <FormattedMessage {...MSG.wrongAddressFormat} />;
  }
  return (
    <span className={styles.address}>
      {`${cutAddress.header}${cutAddress.start}${mask}${cutAddress.end}`}
    </span>
  );
};

export default MaskedAddress;
