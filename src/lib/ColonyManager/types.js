/* @flow */

import { COLONY_CONTEXT, NETWORK_CONTEXT, TOKEN_CONTEXT } from './constants';

export type ColonyContext =
  | typeof COLONY_CONTEXT
  | typeof NETWORK_CONTEXT
  | typeof TOKEN_CONTEXT;

export type ENSName = string;

export type Address = string;

export type AddressOrENSName = Address | ENSName;
