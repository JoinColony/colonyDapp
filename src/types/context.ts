import {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';

import { WalletObjectType } from '@colony/purser-core';
import IPFSNodeType from '../lib/ipfs/index';

export * from '../lib/ColonyManager/types';

export type ColonyClient = ColonyClientType;
export type IPFSNode = IPFSNodeType;
export type NetworkClient = NetworkClientType;
export type Wallet = WalletObjectType;
