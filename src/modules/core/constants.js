/* @flow */

export const CORE_NAMESPACE = 'core';
export const CORE_TRANSACTIONS = 'transactions';
export const CORE_TRANSACTIONS_LIST = 'list';
export const CORE_GAS_PRICES = 'gasPrices';
export const CORE_NETWORK = 'network';
export const CORE_NETWORK_FEE = 'fee';
export const CORE_NETWORK_VERSION = 'version';
export const CORE_IPFS_DATA = 'ipfsData';
/*
 * @NOTE Messages that need to be signed using the user's wallet
 * Don't mistake them for notifications
 */
export const CORE_MESSAGES = 'messages';
export const CORE_MESSAGES_LIST = 'list';

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
  TOKEN_CONTEXT,
} from '../../lib/ColonyManager/constants';
