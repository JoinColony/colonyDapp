/* @flow */

import type { Address, ENSName } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Query,
  WalletContext,
} from '~data/types';

export type ColonyMetadata = {|
  colonyENSName: string | ENSName,
  colonyAddress: Address,
|};

export type ColonyQueryContext = ContextWithMetadata<
  ColonyMetadata,
  ColonyClientContext & DDBContext & WalletContext,
>;

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;

export type ColonyContractTransactionsEventQuery<I: *, R: *> = Query<
  ContextWithMetadata<ColonyMetadata, ColonyClientContext>,
  I,
  R,
>;

export type ColonyContractRolesEventQuery<I: *, R: *> = Query<
  {| ...ColonyClientContext, ...DDBContext |},
  I,
  R,
>;

export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;

export type TaskQueryContext = ContextWithMetadata<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
    taskStoreAddress: string | OrbitDBAddress,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type TaskQuery<I: *, R: *> = Query<TaskQueryContext, I, R>;
