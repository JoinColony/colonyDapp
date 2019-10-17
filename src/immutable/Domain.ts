import {
  Record as ImmutableRecord,
  Map as ImmutableMap,
  Set as ImmutableSet,
  fromJS,
  isKeyed,
} from 'immutable';

import {
  DefaultValues,
  Address,
  ColonyRoles,
  DomainRolesObject,
} from '~types/index';

interface Shared {
  id: number;
  name: string;
  parentId: number | null;
}

interface DomainRecordProps extends Shared {
  roles: ImmutableMap<Address, ImmutableSet<ColonyRoles>>;
  // pendingRoles: ImmutableMap<Address, ImmutableSet<Roles>>;
}

export interface DomainType extends Readonly<Shared> {
  readonly roles: DomainRolesObject;
  // readonly pendingRoles: DomainRolesObject;
}

export type DomainId = DomainType['id'];

const defaultValues: DefaultValues<DomainRecordProps> = {
  id: undefined,
  name: undefined,
  parentId: undefined,
  roles: ImmutableMap<Address, ImmutableSet<ColonyRoles>>(),
  // pendingRoles: ImmutableMap<Address, ImmutableSet<Roles>>(),
};

export class DomainRecord extends ImmutableRecord<DomainRecordProps>(
  defaultValues,
) {
  toJS(): DomainType {
    // `toJS` converts `ImmutableSet` to `Array` rather than `Set`
    const { roles, ...props } = super.toJS() as Omit<DomainType, 'roles'> & {
      roles: Record<Address, ColonyRoles[]>;
    };
    return {
      ...props,
      roles: Object.entries(roles).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: new Set<ColonyRoles>([...value]),
        }),
        {},
      ),
    };
  }
}

export const rolesFromJS = (
  roles: DomainType['roles'],
): DomainRecordProps['roles'] =>
  ImmutableMap<Address, ImmutableSet<ColonyRoles>>(
    fromJS(roles, (key, value) =>
      isKeyed(value) ? value.toMap() : value.toSet(),
    ),
  );

export const applyDomainRoleChanges = (
  roles: ImmutableSet<ColonyRoles>,
  changes: Record<ColonyRoles, boolean>,
): ImmutableSet<ColonyRoles> => {
  const changedRoles = (Object.keys(changes) as unknown) as ColonyRoles[];
  return ImmutableSet(
    [...roles, ...changedRoles].filter(role =>
      Object.hasOwnProperty.call(changes, role) ? changes[role] : true,
    ),
  );
};

export const Domain = ({ roles, ...props }: DomainType): DomainRecord =>
  new DomainRecord({
    ...props,
    roles: rolesFromJS(roles),
  });
