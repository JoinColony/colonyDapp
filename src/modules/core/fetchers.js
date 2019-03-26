/* @flow */
/* eslint-disable import/prefer-default-export */

import { networkSelector } from './selectors';
import { fetchNetworkVersion } from './actionCreators';

export const networkVersionFetcher = {
  select: networkSelector,
  fetch: fetchNetworkVersion,
};
