/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { maskAddress } from '~utils/strings';

import styles from './MaskedAddress.css';

const MSG = defineMessages({
  wrongAddressFormat: {
    id: 'MaskedAddress.wrongAddressFormat',
    defaultMessage: 'Address format is wrong!',
  },
});

type Props = {
  /*
   * The address to be masked by the helper util
   */
  address: string,
  /*
   * String patter to use when masking the address
   */
  mask?: string,
};

const MaskedAddress = ({ address, mask }: Props) => {
  const maskedAddress: string | Error = maskAddress(address, mask);
  if (maskedAddress instanceof Error) {
    return <FormattedMessage {...MSG.wrongAddressFormat} />;
  }
  return <span className={styles.address}>{maskedAddress}</span>;
};

export default MaskedAddress;
