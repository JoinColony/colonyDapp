/* @flow */
/* eslint-disable import/prefer-default-export */

import { networkSelector, ipfsDataSelector } from './selectors';
import { fetchNetworkVersion, fetchIpfsData } from './actionCreators';

export const networkVersionFetcher = Object.freeze({
  select: networkSelector,
  fetch: fetchNetworkVersion,
});

export const ipfsDataFetcher = Object.freeze({
  select: ipfsDataSelector,
  fetch: fetchIpfsData,
});
