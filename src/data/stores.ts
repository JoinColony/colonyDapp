import { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
// import { WalletObjectType } from '@colony/purser-core/flowtypes';

import { Address, DDB } from '~types/index';
import { ColonyStore } from './types';

import {
  colony as colonyStoreBlueprint,
  colonyTaskIndex as colonyTaskIndexStoreBlueprint,
} from './blueprints';

// This should be more specific
type WalletObjectType = any;

/*
 * @NOTE:
 * 5 is the chainId for goerli: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
 *
 * This shouldn't be used anywhere else. This is just about adding chainIds to
 * store addresses. DO NOT USE IT.
 *
 * If you use it somewhere else, I'll give you this look:
 * https://media.tenor.com/images/fbd6b74410e14c0ac96517eba36d44d0/tenor.gif
 *
 */
const CHAIN_ID = process.env.CHAIN_ID || '5';

export const getColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.getStore<ColonyStore>(colonyStoreBlueprint, colonyAddress, {
    chainId: CHAIN_ID,
    colonyAddress,
    colonyClient,
    wallet,
  });

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) => {
  const chainId = CHAIN_ID;
  const colonyStore = await ddb.createStore<ColonyStore>(colonyStoreBlueprint, {
    chainId,
    colonyAddress,
    colonyClient,
    wallet,
  });

  const colonyTaskIndexStore = await ddb.createStore<any>(
    colonyTaskIndexStoreBlueprint,
    {
      chainId,
      colonyAddress,
      colonyClient,
      wallet,
    },
  );

  return { colonyStore, colonyTaskIndexStore };
};
