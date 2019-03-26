/* @flow */

import type { Saga } from 'redux-saga';

import { call, select } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import { currentUserMetadataSelector } from '../../users/selectors';

export function* getColonyContext(
  colonyENSName: ?string,
  colonyAddress: ?string,
): Saga<Object> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  if (!colonyManager)
    throw new Error('Cannot get colony context. Invalid manager instance');
  const identifier = colonyENSName || colonyAddress;
  if (!identifier)
    throw new Error('Cannot get colony context. Invalid identifier');
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    identifier,
  );
  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyENSName,
      colonyAddress: colonyClient.contract.address,
    },
  };
}

export function* getUserMetadataStoreContext(): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const { metadataStoreAddress: userMetadataStoreAddress } = yield select(
    currentUserMetadataSelector,
  );
  return {
    ddb,
    wallet,
    metadata: {
      userMetadataStoreAddress,
      walletAddress: wallet.address,
    },
  };
}
