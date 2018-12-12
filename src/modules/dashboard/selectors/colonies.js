/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ColonyRecord } from '~immutable';

type RootState = {
  [typeof ns]: {
    colonies: ImmutableMap<ENSName, ColonyRecord>,
  },
};

export const allColonies = (state: RootState) => state[ns].colonies;

export const singleColony = (state: RootState, ensName: ENSName) =>
  allColonies(state).get(ensName);
