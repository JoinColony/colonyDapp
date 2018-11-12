/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext, put } from 'redux-saga/effects';
import { providers } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import ColonyNetworkClient from '@colony/colony-js-client';
import NetworkLoader from '@colony/colony-js-contract-loader-network';

import { create } from '~utils/saga/effects';
import EthersWrappedWallet from '../../../lib/EthersWrappedWallet';

import type { TransactionAction, LifecycleActionTypes } from '../types';

import methodSagaFactory from './utils/methodSagaFactory';

/**
 * Return an initialized ColonyNetworkClient instance.
 */
// eslint-disable-next-line import/prefer-default-export
export function* getNetworkClient(): Saga<ColonyNetworkClient> {
  const network = process.env.NETWORK || 'rinkeby';
  const provider =
    network === 'local'
      ? yield create(providers.JsonRpcProvider)
      : yield call(providers.getDefaultProvider, network);
  const wallet = yield getContext('wallet');

  let loader;
  switch (process.env.LOADER) {
    case 'trufflepig':
      loader = yield create(TrufflepigLoader);
      break;
    default:
      loader = yield create(NetworkLoader, { network });
      break;
  }

  const adapter = yield create(EthersAdapter, {
    loader,
    provider,
    // $FlowFixMe colonyJS IWallet types are wrong!
    wallet: yield create(EthersWrappedWallet, wallet, provider),
  });

  const networkClient = yield create(ColonyNetworkClient, {
    adapter,
    query: {},
  });

  yield call([networkClient, networkClient.init]);

  return networkClient;
}

export function networkMethodSagaFactory<Params: Object, EventData: Object>(
  methodName: string,
  lifecycleActionTypes: LifecycleActionTypes,
) {
  return function* networkMethodSaga(
    action: TransactionAction<Params>,
  ): Saga<void> {
    try {
      // Get the named method from the `networkClient` context.
      const { [methodName]: method } = yield getContext('networkClient');

      // Create a saga for this method and given success/error action types,
      // then immediately call it with the given action.
      const saga = methodSagaFactory<Params, EventData>(
        method,
        lifecycleActionTypes,
      );
      yield call(saga, action);
    } catch (error) {
      const { error: errorType } = lifecycleActionTypes;
      if (errorType) {
        yield put({ type: errorType, payload: error });
      } else {
        throw error;
      }
    }
  };
}
