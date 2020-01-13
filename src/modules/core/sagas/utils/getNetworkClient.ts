import { call } from 'redux-saga/effects';
import { getNetworkClient } from '@colony/colony-js-client';

import { DEFAULT_NETWORK } from '~constants';
import { TEMP_getNewContext } from '~context/index';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getClient() {
  const wallet = TEMP_getNewContext('wallet');

  return yield call(
    getNetworkClient,
    DEFAULT_NETWORK,
    wallet,
    process.env.INFURA_ID,
    !!process.env.VERBOSE,
  );
}
