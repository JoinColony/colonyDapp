import { UserType } from '~immutable/index';
import { ColonyRoles, ColonyRoleSet } from '~types/index';

export const canEnterRecoveryMode = (roles: ColonyRoleSet) =>
  roles.has(ColonyRoles.RECOVERY);

export const canAdminister = (roles: ColonyRoleSet) =>
  roles.has(ColonyRoles.ADMINISTRATION);

export const isFounder = (roles: ColonyRoleSet) => roles.has(ColonyRoles.ROOT);

export const userDidClaimProfile = ({ profile: { username } }: UserType) =>
  !!username;
