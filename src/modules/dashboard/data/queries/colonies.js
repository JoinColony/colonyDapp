/* @flow */

import type { Address } from '~types';

import type {
  ColonyManager,
  ColonyClient,
  ColonyStore,
  DDB,
  Event,
  NetworkClient,
  Query,
  Wallet,
} from '~data/types';

import type { ColonyType, DomainType } from '~immutable';

import BigNumber from 'bn.js';
import { CONTEXT } from '~context';
import { COLONY_EVENT_TYPES } from '~data/constants';

import { reduceToLastState, getLast } from '~utils/reducers';
import { getColonyStore } from '~data/stores';
import { getEvents } from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { getTokenClient } from '~utils/web3/contracts';
import { addressEquals } from '~utils/strings';

import { colonyReducer, colonyTasksReducer } from '../reducers';

const {
  DOMAIN_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
} = COLONY_EVENT_TYPES;

type ColonyStoreMetadata = {|
  colonyAddress: Address,
|};
type ContractEventQuery<A, R> = Query<ColonyClient, ColonyStoreMetadata, A, R>;

const context = [CONTEXT.COLONY_MANAGER];
const colonyContext = [
  CONTEXT.COLONY_MANAGER,
  CONTEXT.DDB_INSTANCE,
  CONTEXT.WALLET,
];

export const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {|
    colonyManager: ColonyManager,
  |},
  { colonyAddress }: ColonyStoreMetadata,
) => {
  if (!colonyAddress)
    throw new Error('Cannot prepare query. Metadata is invalid');
  return colonyManager.getColonyClient(colonyAddress);
};

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const getColonyRoles: ContractEventQuery<
  void,
  { admins: string[], founder: string },
> = {
  name: 'getColonyRoles',
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      events: { ColonyAdministrationRoleSet, ColonyRootRoleSet },
    } = colonyClient;
    const events = await getEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [ColonyAdministrationRoleSet, ColonyRootRoleSet],
      },
    );
    const { eventName: ADMINISTRATION_SET } = ColonyAdministrationRoleSet;
    const { eventName: ROOT_SET } = ColonyRootRoleSet;

    // get the founder from the most recent ROOT_SET event
    const founderEvent = getLast(
      events,
      ({ eventName, setTo }) => eventName === ROOT_SET && setTo === true,
    );
    const founder = founderEvent && founderEvent.address;

    // get admins from ADMINISTRATION_SET events which are not founder
    const getKey = event => event.address;
    const getValue = event => event;
    const admins = reduceToLastState(events, getKey, getValue)
      .filter(
        ([, { eventName, setTo, address }]) =>
          eventName === ADMINISTRATION_SET &&
          setTo === true &&
          address !== founder,
      )
      .map(([user]) => user);

    return {
      admins,
      founder,
    };
  },
};

/**
 * @todo Get the right defaults for data reducers based on the redux data.
 */
export const getColony: Query<
  {| colonyClient: ColonyClient, colonyStore: ColonyStore |},
  ColonyStoreMetadata,
  {| colonyAddress: Address |},
  ColonyType,
> = {
  name: 'getColony',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return {
      colonyClient,
      colonyStore,
    };
  },
  async execute({ colonyStore, colonyClient }, { colonyAddress }) {
    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(colonyReducer, {
        avatarHash: undefined,
        colonyAddress,
        colonyName: '',
        displayName: '',
        inRecoveryMode,
        tokens: {
          // also include Ether
          [ZERO_ADDRESS]: {
            address: ZERO_ADDRESS,
          },
        },
      });
  },
};

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  {
    [draftId: string]: {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
    |},
  },
> = {
  name: 'getColonyTasks',
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(
        ({ type }) =>
          type === TASK_STORE_REGISTERED || type === TASK_STORE_UNREGISTERED,
      )
      .reduce(colonyTasksReducer, {});
  },
};

export const getColonyDomains: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  DomainType[],
> = {
  name: 'getColonyDomains',
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(({ type }) => type === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: Event<typeof DOMAIN_CREATED>) => ({
        id: domainId,
        name,
      }));
  },
};

export const getColonyTokenBalance: Query<
  NetworkClient,
  void,
  {| colonyAddress: Address, tokenAddress: Address |},
  BigNumber,
> = {
  name: 'getColonyTokenBalance',
  context: colonyContext,
  prepare: async ({
    colonyManager: { networkClient },
  }: {|
    colonyManager: ColonyManager,
  |}) => networkClient,
  async execute(networkClient, { colonyAddress, tokenAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    // if ether, handle differently
    if (addressEquals(tokenAddress, ZERO_ADDRESS)) {
      const etherBalance = await provider.getBalance(colonyAddress);

      // convert from Ethers BN
      return new BigNumber(etherBalance.toString());
    }

    // otherwise handle as ERC 20
    const tokenClient = await getTokenClient(tokenAddress, networkClient);
    const { amount } = await tokenClient.getBalanceOf.call({
      sourceAddress: colonyAddress,
    });

    // convert from Ethers BN
    return new BigNumber(amount.toString());
  },
};
