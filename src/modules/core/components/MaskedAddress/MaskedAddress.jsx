/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { maskAddress } from '~utils/strings';

import ErrorBoundry from '~core/ErrorBoundry';

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

/*
 * This intermediate component is needed since `componentDidCatch` catch only
 * triggers for the `render` method
 */
const MaskAddress = ({ address, mask = '...' }: Props) => (
  <span>{maskAddress(address, mask)}</span>
);

const MaskedAddress = ({ address, mask }: Props) => (
  <ErrorBoundry message={MSG.wrongAddressFormat}>
    <MaskAddress address={address} mask={mask} />
  </ErrorBoundry>
);

export default MaskedAddress;
