/* @flow */

import { networkSelector, ipfsDataSelector } from './selectors';
import { fetchNetwork, fetchIpfsData } from './actionCreators';

// This is currently unused
export const networkFetcher = Object.freeze({
  select: networkSelector,
  fetch: fetchNetwork,
});

export const ipfsDataFetcher = Object.freeze({
  select: ipfsDataSelector,
  fetch: fetchIpfsData,
  ttl: Infinity, // IPFS hashes should not expire
});
