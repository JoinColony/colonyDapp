import { UserType } from '~immutable/index';
import { ColonyRole } from '~types/index';

type Roles = Record<ColonyRole, boolean>;

export const canEnterRecoveryMode = (roles: Roles | void) =>
  !!(roles && roles.RECOVERY);

export const canAdminister = (roles: Roles | void) =>
  !!(roles && roles.ADMINISTRATION);

export const isFounder = (roles: Roles | void) => !!(roles && roles.ROOT);

export const userDidClaimProfile = ({ profile: { username } }: UserType) =>
  !!username;
