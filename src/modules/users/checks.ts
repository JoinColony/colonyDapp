import { ROLES } from '~constants';

export const userHasRole = (userRoles: ROLES[], role: ROLES) =>
  userRoles.includes(role);

export const canEnterRecoveryMode = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.RECOVERY);

export const canAdminister = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.ADMINISTRATION);

export const canFund = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.FUNDING);

export const hasRoot = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.ROOT);

export const canArchitect = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.ARCHITECTURE);
