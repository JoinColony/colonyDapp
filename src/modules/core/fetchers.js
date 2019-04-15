/* @flow */
/* eslint-disable import/prefer-default-export */

import { networkSelector, ipfsDataSelector } from './selectors';
import {
  fetchNetworkFee,
  fetchNetworkVersion,
  fetchIpfsData,
} from './actionCreators';

export const networkFeeFetcher = Object.freeze({
  select: networkSelector,
  fetch: fetchNetworkFee,
});

export const networkVersionFetcher = Object.freeze({
  select: networkSelector,
  fetch: fetchNetworkVersion,
});

export const ipfsDataFetcher = Object.freeze({
  select: ipfsDataSelector,
  fetch: fetchIpfsData,
});
