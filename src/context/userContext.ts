import { PurserWallet } from '@purser/core';

import ColonyManager from '../lib/ColonyManager';

import { Context } from './constants';

export type UserContext = {
  [Context.COLONY_MANAGER]: ColonyManager;
  [Context.WALLET]: PurserWallet;
};
