/* @flow */
/* eslint-disable import/prefer-default-export */

import { getNetworkVersion } from './selectors';
import { fetchNetworkVersion } from './actionCreators';

export const networkVersionFetcher = {
  select: getNetworkVersion,
  fetch: fetchNetworkVersion,
};
