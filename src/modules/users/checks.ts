import { ColonyRole } from '@colony/colony-js';

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
