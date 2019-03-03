/* @flow */

import type { RootStateRecord } from '~immutable';

import { singleColonySelector } from './selectors';
import { fetchColony } from './actionCreators';

// eslint-disable-next-line import/prefer-default-export
export const colonyFetcher = {
  select: (state: RootStateRecord, ensName: string) =>
    singleColonySelector(state, ensName),
  fetch: (ensName: string) => fetchColony(ensName),
};
