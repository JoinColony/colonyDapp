/* @flow */

import type ColonyNetworkClient from '@colony/colony-js-client';

export type ENSName = string;

export type Address = string;

export type ENSCache = {
  cacheMap: Map<ENSName, Address>,
  getDomain: Address => string,
  getAddress: (ENSName, ColonyNetworkClient) => Promise<string>,
};
