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

export const canUseMetatransactions = (userNetworkId: number): boolean => {
  const isDeployedToUnsupportedNetwork =
    DEFAULT_NETWORK === Network.Xdai ||
    DEFAULT_NETWORK === Network.XdaiFork ||
    (isDev && DEFAULT_NETWORK === Network.Local);
  const isUserWalletOnMainenet = userNetworkId === ETHEREUM_NETWORK.chainId;
  return isDeployedToUnsupportedNetwork && isUserWalletOnMainenet;
};
