import {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';

import { WalletObjectType } from '@colony/purser-core';
import IPFSNodeType from '../lib/ipfs/index';
import ENS from '~lib/ENS/index';

export * from '../lib/ColonyManager/types';

export type ColonyClient = ColonyClientType;
export type ENSCache = ENS;
export type IPFSNode = IPFSNodeType;
export type NetworkClient = NetworkClientType;
export type Wallet = WalletObjectType;
