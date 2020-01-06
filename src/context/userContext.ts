import { WalletObjectType } from '@colony/purser-core';

import ColonyManager from '../lib/ColonyManager';

export type UserContext = {
  colonyManager: ColonyManager;
  wallet: WalletObjectType;
};
