/* @flow */

import { toChecksumAddress } from 'web3-utils';

// An Address type can only be assigned in this file
// https://flow.org/en/docs/types/opaque-types/
export opaque type Address: string = string;

export type ENSName = string;

// eslint-disable-next-line import/prefer-default-export
export const createAddress = (address: string): Address =>
  // This will allow an undefined address, but throw for an invalid address
  toChecksumAddress(address || undefined);
