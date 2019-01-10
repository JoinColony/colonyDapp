/* @flow */

import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../../lib/ColonyManager/constants';

import getColonyManager from './getColonyManager';
import getDDB from './getDDB';
import getGasPrice from './getGasPrice';
import getMethod from './getMethod';
import getNetworkClient from './getNetworkClient';

const getNetworkMethod = getMethod.bind(null, NETWORK_CONTEXT);
const getColonyMethod = getMethod.bind(null, COLONY_CONTEXT);

export {
  getColonyManager,
  getDDB,
  getGasPrice,
  getMethod,
  getNetworkClient,
  getNetworkMethod,
  getColonyMethod,
};
