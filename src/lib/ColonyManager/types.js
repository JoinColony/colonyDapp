/* @flow */

import { COLONY_CONTEXT, NETWORK_CONTEXT } from './constants';

export type ColonyContext = typeof COLONY_CONTEXT | typeof NETWORK_CONTEXT;

export type ENSName = string;

export type Address = string;

export type ColonyIdentifier = {|
  address?: Address,
  ensName?: ENSName,
|};
