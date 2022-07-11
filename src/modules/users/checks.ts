import { ColonyRole, Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';
import { isDev } from '~utils/debug';

export const userHasRole = (userRoles: ColonyRole[], role: ColonyRole) =>
  userRoles.includes(role);

export const canEnterRecoveryMode = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Recovery);

export const canAdminister = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Administration);

export const canFund = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Funding);

export const hasRoot = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Root);

export const canArchitect = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Architecture);

/*
 * There's only two conditions for the user to actually send metatransactions, rather
 * than "normal" ones, besides the user actually turning them on/off
 * 1. The Dapp needs to be deployed to Xdai, that's the only place the Broadcaster works
 * (We also add QA Xdai, and if started in dev mode, the local Ganache network)
 *
 * 2. The global ENV switch needs to be turned on. This is in place for when the
 * broadcaster runs out of funds and we need to emergency shut down the system
 */
export const canUseMetatransactions = (): boolean => {
  const isNetworkSupported =
    DEFAULT_NETWORK === Network.Xdai ||
    DEFAULT_NETWORK === Network.XdaiFork ||
    (isDev && DEFAULT_NETWORK === Network.Local);
  const areMetaTransactionsEnabled = !!process.env.METATRANSACTIONS || false;
  return isNetworkSupported && areMetaTransactionsEnabled;
};
