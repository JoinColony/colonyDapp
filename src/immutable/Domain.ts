import {
  Record as ImmutableRecord,
  Map as ImmutableMap,
  fromJS,
} from 'immutable';

import {
  DefaultValues,
  Address,
  RecordToJS,
  RoleSet,
  RoleSetType,
} from '~types/index';

interface Shared {
  id: number;
  name: string;
  parentId: number | null;
}

export type DomainRolesType = Record<Address, RoleSetType>;

export type DomainRoles = ImmutableMap<Address, RoleSet> & {
  toJS(): DomainRolesType;
};

export type ColonyRolesType = Record<string, DomainRolesType>;

export type ColonyRoles = ImmutableMap<number, DomainRoles> & {
  toJS(): ColonyRolesType;
};

interface DomainRecordProps extends Shared {
  roles: DomainRoles;
  // pendingRoles: ImmutableMap<Address, ImmutableSet<Roles>>;
}

export interface DomainType extends Readonly<Shared> {
  readonly roles: DomainRolesType;
  // readonly pendingRoles: DomainRolesObject;
}

export type DomainId = DomainType['id'];

const defaultValues: DefaultValues<DomainRecordProps> = {
  id: undefined,
  name: undefined,
  parentId: undefined,
  roles: ImmutableMap<Address, RoleSet>(),
  // pendingRoles: ImmutableMap<Address, ImmutableSet<Roles>>(),
};

export class DomainRecord
  extends ImmutableRecord<DomainRecordProps>(defaultValues)
  implements RecordToJS<DomainType> {}

export const Domain = ({ roles, ...props }: DomainType): DomainRecord =>
  new DomainRecord({
    ...props,
    roles: fromJS(roles),
  });
