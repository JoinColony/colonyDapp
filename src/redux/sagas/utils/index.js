/* @flow */

import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

import getMethod from './getMethod';

export { default as getColonyManager } from './getColonyManager';
export { default as getDDB } from './getDDB';
export { default as getGasPrices } from './getGasPrices';
export { default as getNetworkClient } from './getNetworkClient';
export { default as getMethod } from './getMethod';
export { getProvider, defaultNetwork } from './getProvider';

export const getNetworkMethod = getMethod.bind(null, NETWORK_CONTEXT);
export const getColonyMethod = getMethod.bind(null, COLONY_CONTEXT);
