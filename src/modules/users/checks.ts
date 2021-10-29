import { ColonyRole, Network } from '@colony/colony-js';

import { DEFAULT_NETWORK, ETHEREUM_NETWORK } from '~constants';
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
 * There's two conditions for the user to actually send metatransactions, rather
 * than "normal" ones, besides the user actually turning them on/off
 * 1. App needs to be deployed to Xdai, that's the only place the Broadcaster works
 * (We also add QA Xdai, and if started in dev mode, the local Ganache network)
 * 2. The wallet is connected to mainnet
 */
export const canUseMetatransactions = (userNetworkId: number): boolean => {
  const isDeployedToSupportedNetwork =
    DEFAULT_NETWORK === Network.Xdai ||
    DEFAULT_NETWORK === Network.XdaiFork ||
    (isDev && DEFAULT_NETWORK === Network.Local);
  const isUserWalletOnMainenet = userNetworkId === ETHEREUM_NETWORK.chainId;
  return isDeployedToSupportedNetwork && isUserWalletOnMainenet;
};
