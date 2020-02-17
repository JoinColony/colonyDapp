import { toChecksumAddress } from 'web3-utils';

import { Address } from '~types/index';

export const createAddress = (address: string): Address =>
  // This will allow an undefined address, but throw for an invalid address
  toChecksumAddress(address || undefined);
