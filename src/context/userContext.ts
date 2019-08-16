import { WalletObjectType } from '@colony/purser-core';
import { DDB } from '../lib/database';

import ColonyManager from '../lib/ColonyManager';

export type UserContext = {
  colonyManager: ColonyManager;
  ddb: DDB;
  wallet: WalletObjectType;
};
