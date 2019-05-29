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
      events: {
        ColonyAdministrationRoleSet,
        ColonyArchitectureRoleSet,
        ColonyFundingRoleSet,
        ColonyRootRoleSet,
      },
      contract: { address: colonyAddress },
    } = colonyClient;
    const events = await getEvents(
      colonyClient,
      {
        address: colonyAddress,
      },
      {
        blocksBack: 400000,
        events: [
          ColonyAdministrationRoleSet,
          ColonyArchitectureRoleSet,
          ColonyFundingRoleSet,
          ColonyRootRoleSet,
        ],
      },
    );
    const { eventName: ADMINISTRATION_SET } = ColonyAdministrationRoleSet;
    const { eventName: ARCHITECTURE_SET } = ColonyArchitectureRoleSet;
    const { eventName: FUNDING_SET } = ColonyFundingRoleSet;
    const { eventName: ROOT_SET } = ColonyRootRoleSet;

    // reduce events to { [address]: { [role]: boolean } }
    const addressRoles = events.reduce(
      (acc, { address, eventName, setTo }) => ({
        ...acc,
        [address]: { ...acc[address], [eventName]: setTo },
      }),
      {},
    );

    // find user with all the roles OldRoles sets for founder
    const founder =
      Object.keys(addressRoles).find(
        address =>
          addressRoles[address][ADMINISTRATION_SET] &&
          addressRoles[address][ARCHITECTURE_SET] &&
          addressRoles[address][FUNDING_SET] &&
          addressRoles[address][ROOT_SET],
      ) || ZERO_ADDRESS;

    // find users with administration role
    const admins = Object.keys(addressRoles).filter(
      address =>
        addressRoles[address][ADMINISTRATION_SET] &&
        !addressEquals(address, founder),
    );

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
    const { version } = await colonyClient.getVersion.call();

    // wrap this in a try/catch since it will fail if token doesn't support locking
    let isNativeTokenLocked;
    try {
      ({
        locked: isNativeTokenLocked,
      } = await colonyClient.tokenClient.isLocked.call());
    } catch (error) {
      isNativeTokenLocked = false;
    }

    // estimate will throw if we're unable to unlock
    let canUnlockNativeToken;
    try {
      await colonyClient.tokenClient.unlock.estimate({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(colonyReducer, {
        avatarHash: undefined,
        colonyAddress,
        colonyName: '',
        displayName: '',
        inRecoveryMode,
        isNativeTokenLocked,
        canUnlockNativeToken,
        tokens: {
          // also include Ether
          [ZERO_ADDRESS]: {
            address: ZERO_ADDRESS,
          },
        },
        version,
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

export const getColonyCanMintNativeToken: Query<
  ColonyClient,
  {| colonyAddress: Address |},
  void,
  boolean,
> = {
  name: 'getColonyCanMintNativeToken',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
    }: {|
      colonyManager: ColonyManager,
    |},
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    return colonyManager.getColonyClient(colonyAddress);
  },
  async execute(colonyClient) {
    try {
      await colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
    } catch (error) {
      return false;
    }
    return true;
  },
};
