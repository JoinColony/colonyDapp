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

  /*
   * In some instances we want to show the full address
   * Ironic, no? A full "masked" address :)
   */
  full?: boolean;
}

const MaskedAddress = ({ address, mask = '...', full = false }: Props) => {
  const cutAddress: AddressElements | Error = splitAddress(address);
  if (cutAddress instanceof Error) {
    return <FormattedMessage {...MSG.wrongAddressFormat} />;
  }
  if (!full) {
    return (
      <span className={styles.address} title={address}>
        {`${cutAddress.header}${cutAddress.start}${mask}${cutAddress.end}`}
      </span>
    );
  }
  return (
    <span className={styles.address} title={address}>
      {cutAddress.header}
      {cutAddress.start}
      <span className={styles.middleSection}>{cutAddress.middle}</span>
      {cutAddress.end}
    </span>
  );
};

export default MaskedAddress;
