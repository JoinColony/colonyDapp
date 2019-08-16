import { toChecksumAddress } from 'web3-utils';

// An Address type can only be assigned in this file
// export type Address = Opaque<string, { readonly tag: unique symbol }>;
export type Address = string;

export type ENSName = string;

export const createAddress = (address: string): Address =>
  // This will allow an undefined address, but throw for an invalid address
  toChecksumAddress(address || undefined);
