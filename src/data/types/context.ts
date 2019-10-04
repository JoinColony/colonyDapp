import {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';

import { WalletObjectType } from '@colony/purser-core';
import { DDB as DDBType } from '../../lib/database/index';
import IPFSNodeType from '../../lib/ipfs/index';
import ColonyManagerType from '../../lib/ColonyManager/index';
import ENS from '~lib/ENS/index';

export type ColonyClient = ColonyClientType;
export type ColonyManager = ColonyManagerType;
export type DDB = DDBType;
export type ENSCache = ENS;
export type IPFSNode = IPFSNodeType;
export type NetworkClient = NetworkClientType;
export type Wallet = WalletObjectType;
