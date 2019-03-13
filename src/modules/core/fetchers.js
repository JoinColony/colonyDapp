/* @flow */
/* eslint-disable import/prefer-default-export */

import { getNetwork } from './selectors';
import { fetchNetworkVersion } from './actionCreators';

export const networkVersionFetcher = {
  select: getNetwork,
  fetch: fetchNetworkVersion,
};
