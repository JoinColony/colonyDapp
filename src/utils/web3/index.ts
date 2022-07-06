import BN from 'bn.js';
import { getAddress, padZeros, hexlify } from 'ethers/utils';
import { ClientType, ContractClient, TokenClientType } from '@colony/colony-js';

import { Address, ExtendedClientType } from '~types/index';
import { TransactionError } from '~immutable/Transaction';

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

export const generateMetatransactionErrorMessage = (
  emmitentClient: ContractClient,
) =>
  `Contract does not support MetaTransactions. ${emmitentClient.clientType}${
    emmitentClient.clientType === ClientType.TokenClient
      ? ` of type ${emmitentClient.tokenClientType}`
      : ''
  } at ${emmitentClient.address}`;

export function intArrayToBytes32(arr: Array<number>) {
  return `0x${new BN(
    arr.map((num) => new BN(1).shln(num)).reduce((a, b) => a.or(b), new BN(0)),
  ).toString(16, 64)}`;
}

export const isGasStationMetatransactionError = (
  error?: TransactionError,
): boolean =>
  !!error?.message.includes('Contract does not support MetaTransactions');

/*
 * Attempt to detect, poorly, if the error originated from our own contracts
 * because we know they support Metatransactions, hence they're out of date.
 *
 * If the error originated from other contracts, it means they most likely
 * don't support metatransactions
 *
 * Also, as a side note, this can only happen, currently, for the TokenClient
 * contracts
 */
export const isMetatransactionErrorFromColonyContract = (
  error?: TransactionError,
): boolean => {
  if (!error?.message) {
    return false;
  }
  const CLIENT_ADDRESS_REGEX = /\.\s(.*Client)\s/;
  const TOKEN_TYPE_REGEX = /of\stype\s(.*)\sat/;
  let tokenType: string = TokenClientType.Erc20;
  const [, clientType] = error.message.match(CLIENT_ADDRESS_REGEX) || [];
  if (clientType === ClientType.TokenClient) {
    [, tokenType] = error.message.match(TOKEN_TYPE_REGEX) || [];
  }
  const isCorrectClient = [
    ...Object.values(ClientType),
    ...Object.values(ExtendedClientType),
  ].includes(clientType as ClientType);
  const isCorrectToken = tokenType === TokenClientType.Colony;
  if (clientType === ClientType.TokenClient) {
    return isCorrectClient && isCorrectToken;
  }
  return isCorrectClient;
};
