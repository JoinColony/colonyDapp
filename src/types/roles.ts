export type UserRolesObject = { [role: string]: boolean };

export type DomainRolesObject = { [userAddress: string]: UserRolesObject };

export type ColonyRolesObject = { [domainId: number]: DomainRolesObject };
