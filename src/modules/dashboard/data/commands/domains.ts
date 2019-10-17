import * as yup from 'yup';

import { Address } from '~types/index';
import { ColonyManager, ColonyStore, Command, DDB, Wallet } from '~data/types';
import { Context } from '~context/index';
import { createEvent } from '~data/utils';
import { EventTypes } from '~data/constants';
import { getColonyStore } from '~data/stores';
import {
  CreateDomainCommandArgsSchema,
  EditDomainCommandArgsSchema,
} from './schemas';

interface ColonyStoreMetadata {
  colonyAddress: Address;
}

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const createDomain: Command<
  ColonyStore,
  ColonyStoreMetadata,
  yup.InferType<typeof CreateDomainCommandArgsSchema>,
  ColonyStore
> = {
  name: 'createDomain',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: CreateDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createEvent(EventTypes.DOMAIN_CREATED, args));
    return colonyStore;
  },
};

export const editDomain: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    name: string;
    domainId: number;
  },
  ColonyStore
> = {
  name: 'editDomain',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: EditDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createEvent(EventTypes.DOMAIN_EDITED, args));
    return colonyStore;
  },
};
