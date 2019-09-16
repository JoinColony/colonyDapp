import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

interface Shared {
  canEnterRecoveryMode: boolean;
  isAdmin: false;
  isFounder: false;
}

export type UserPermissionsType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  canEnterRecoveryMode: false,
  isAdmin: false,
  isFounder: false,
};

export class UserPermissionsRecord extends Record<Shared>(defaultValues) {}

export const UserPermissions = (p: Shared) => new UserPermissionsRecord(p);
