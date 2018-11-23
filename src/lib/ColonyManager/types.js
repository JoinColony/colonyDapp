/* @flow */

import { COLONY_CONTEXT, NETWORK_CONTEXT } from './constants';

export type ColonyContext = typeof COLONY_CONTEXT | typeof NETWORK_CONTEXT;

export type ColonyIdentifier = {|
  address?: string,
  ensName?: string,
  id?: number,
|};
