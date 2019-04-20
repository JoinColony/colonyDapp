/* @flow */

import { networkSelector, ipfsDataSelector } from './selectors';
import { fetchNetwork, fetchIpfsData } from './actionCreators';

export const networkFetcher = Object.freeze({
  select: networkSelector,
  fetch: fetchNetwork,
});

export const ipfsDataFetcher = Object.freeze({
  select: ipfsDataSelector,
  fetch: fetchIpfsData,
});
