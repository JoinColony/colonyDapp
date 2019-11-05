import { ROLES } from '~constants';
import { UserType } from '~immutable/index';

export const userHasRole = (userRoles: ROLES[], role: ROLES) =>
  userRoles.includes(role);

export const canEnterRecoveryMode = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.RECOVERY);

export const canAdminister = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.ADMINISTRATION);

export const canFund = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.FUNDING);

export const isFounder = (userRoles: ROLES[]) =>
  userHasRole(userRoles, ROLES.ROOT);

export const userDidClaimProfile = ({ profile: { username } }: UserType) =>
  !!username;
