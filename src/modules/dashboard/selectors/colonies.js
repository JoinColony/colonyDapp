/* @flow */

import { Data } from '~utils/reducers';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ColonyRecord } from '~immutable';
import type { DataRecordMap, DataRecord } from '~utils/reducers';

type RootState = {
  [typeof ns]: {
    colonies: DataRecordMap<ENSName, ColonyRecord>,
  },
};

export const allColonies = (state: RootState) => state[ns].colonies;

export const singleColony = (
  state: RootState,
  ensName: ENSName,
): DataRecord<ColonyRecord> =>
  allColonies(state).get(ensName, Data({ fetching: 0 }));
