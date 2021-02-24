import BN from 'bn.js';
import { getAddress, padZeros, hexlify } from 'ethers/utils';

import { Address } from '~types/index';

export const createAddress = (address: string): Address => getAddress(address);

// @TODO ethers v5 will have an isAddress utility function
export const isAddress = (address: string) => {
  try {
    getAddress(address);
  } catch {
    return false;
  }
  return true;
};

export const padLeft = padZeros;
export const toHex = hexlify;

export type Unit =
  | 'noether'
  | 'wei'
  | 'kwei'
  | 'Kwei'
  | 'babbage'
  | 'femtoether'
  | 'mwei'
  | 'Mwei'
  | 'lovelace'
  | 'picoether'
  | 'gwei'
  | 'Gwei'
  | 'shannon'
  | 'nanoether'
  | 'nano'
  | 'szabo'
  | 'microether'
  | 'micro'
  | 'finney'
  | 'milliether'
  | 'milli'
  | 'ether'
  | 'kether'
  | 'grand'
  | 'mether'
  | 'gether'
  | 'tether';

export const isTransactionFormat = (
  potentialTransactionHash?: string,
): boolean => {
  const hexStringRegex = /^0x([A-Fa-f0-9]{64})$/;
  if (!potentialTransactionHash) {
    return false;
  }
  return !!potentialTransactionHash.match(hexStringRegex);
};

export function intArrayToBytes32(arr: Array<number>) {
  return `0x${new BN(
    arr.map((num) => new BN(1).shln(num)).reduce((a, b) => a.or(b), new BN(0)),
  ).toString(16, 64)}`;
}
