import { call } from 'redux-saga/effects';
import { getNetworkClient } from '@colony/colony-js-client';

import { Context, getContext } from '~context/index';

import { DEFAULT_NETWORK } from '../../constants';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getClient() {
  const wallet = yield getContext(Context.WALLET);

  return yield call(
    getNetworkClient,
    DEFAULT_NETWORK,
    wallet,
    process.env.INFURA_ID,
    !!process.env.VERBOSE,
  );
}
