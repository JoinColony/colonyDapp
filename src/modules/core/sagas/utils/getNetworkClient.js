/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';
import ColonyNetworkClient, {
  getNetworkClient,
} from '@colony/colony-js-client';

import { CONTEXT, getContext } from '~context';

import { defaultNetwork } from './getProvider';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getClient(): Saga<ColonyNetworkClient> {
  const wallet = yield* getContext(CONTEXT.WALLET);

  return yield call(getNetworkClient, defaultNetwork, wallet);
}
