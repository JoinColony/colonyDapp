import { Set as ImmutableSet } from 'immutable';

import { ROOT_DOMAIN, ROLES } from '~constants';
import { Address, RoleSet, createAddress, ENSCache } from '~types/index';
import { ColonyClient, ColonyManager, NetworkClient, Query } from '~data/types';
import { ColonyRolesType, DomainRolesType } from '~immutable/index';

import { Context } from '~context/index';
import { getEvents } from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';

interface ColonyStoreMetadata {
  colonyAddress: Address;
}

interface ColonyTaskIndexStoreMetadata {
  colonyAddress: Address;
}

type ContractEventQuery<A, R> = Query<ColonyClient, ColonyStoreMetadata, A, R>;

interface ColonyRoleSetEventData {
  address: Address;
  domainId: number;
  role: ROLES;
  setTo: boolean;
  eventName: 'ColonyRoleSet';
}

const context = [Context.COLONY_MANAGER];

export const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {
    colonyManager: ColonyManager;
  },
  { colonyAddress }: ColonyStoreMetadata,
) => {
  if (!colonyAddress)
    throw new Error('Cannot prepare query. Metadata is invalid');
  return colonyManager.getColonyClient(colonyAddress);
};

// This will be unnecessary as soon as we have the RecoveryRoleSet event on the ColonyClient
export const TEMP_getUserHasColonyRole: ContractEventQuery<
  { userAddress },
  boolean
> = {
  name: 'getUserHasRecoveryRole',
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient, { userAddress = ZERO_ADDRESS }) {
    if (!userAddress || userAddress === ZERO_ADDRESS) return false;
    const { hasRole } = await colonyClient.hasColonyRole.call({
      address: userAddress,
      domainId: ROOT_DOMAIN,
      role: ROLES.RECOVERY,
    });
    return hasRole;
  },
};

export const getColonyRoles: ContractEventQuery<void, ColonyRolesType> = {
  name: 'getColonyRoles',
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      events: { ColonyRoleSet },
      contract: { address: colonyAddress },
    } = colonyClient;
    const events = await getEvents(
      colonyClient,
      {
        address: colonyAddress,
        fromBlock: 1,
      },
      {
        events: [ColonyRoleSet],
      },
    );

    // get extension addresses for the colony
    const {
      address: oneTxAddress,
    } = await colonyClient.getExtensionAddress.call({
      contractName: 'OneTxPayment',
    });
    const extensionAddresses = [createAddress(oneTxAddress)];

    return (
      events
        // Normalize the address
        .map(event => ({ ...event, address: createAddress(event.address) }))
        // Don't include roles of extensions
        .filter(({ address }) => !extensionAddresses.includes(address))
        // Reduce events to { [domainId]: { [address]: Set<Role> } }
        .reduce(
          (
            colonyRoles,
            { address, setTo, role, domainId }: ColonyRoleSetEventData,
          ) => {
            const domainRoles =
              colonyRoles[domainId.toString()] || ({} as DomainRolesType);
            const userRoles: RoleSet =
              ImmutableSet(domainRoles[address]) || ImmutableSet();

            return {
              ...colonyRoles,
              [domainId.toString()]: {
                ...domainRoles,
                // Add or remove the role, depending on the value of setTo
                [address as Address]: setTo
                  ? Array.from(userRoles.add(role))
                  : Array.from(userRoles.remove(role)),
              },
            };
          },
          {} as ColonyRolesType,
        )
    );
  },
};

export const checkColonyNameIsAvailable: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { colonyName: string },
  boolean
> = {
  name: 'checkColonyNameIsAvailable',
  context: [Context.COLONY_MANAGER, Context.ENS_INSTANCE],
  async prepare({
    colonyManager: { networkClient },
    ens,
  }: {
    colonyManager: ColonyManager;
    ens: ENSCache;
  }) {
    return { ens, networkClient };
  },
  async execute({ ens, networkClient }, { colonyName }) {
    return ens.isENSNameAvailable('colony', colonyName, networkClient);
  },
};
