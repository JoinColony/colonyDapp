import {
  Record as ImmutableRecord,
  Map as ImmutableMap,
  Set as ImmutableSet,
  fromJS,
  isKeyed,
} from 'immutable';

import { ROLES } from '~constants';
import { DefaultValues, Address, RoleSet, RoleSetType } from '~types/index';

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

export class DomainRecord extends ImmutableRecord<DomainRecordProps>(
  defaultValues,
) {
  static rolesFromJS(roles: DomainType['roles']): DomainRecordProps['roles'] {
    return ImmutableMap<Address, ImmutableSet<ROLES>>(
      fromJS(roles, (key, value) =>
        isKeyed(value) ? value.toMap() : value.toSet(),
      ),
    ) as DomainRecordProps['roles'];
  }

  toJS(): DomainType {
    // `toJS` converts `ImmutableSet` to `Array` rather than `Set`
    const { roles, ...props } = super.toJS() as Omit<DomainType, 'roles'> & {
      roles: Record<Address, ROLES[]>;
    };
    return {
      ...props,
      roles: Object.entries(roles).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: new Set<ROLES>([...value]),
        }),
        {},
      ),
    };
  }
}

export const Domain = ({ roles, ...props }: DomainType): DomainRecord =>
  new DomainRecord({
    ...props,
    roles: DomainRecord.rolesFromJS(roles),
  });
