/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord } from '~immutable';

import { allColonies } from '../../dashboard/selectors';

type RootState = {
  [string]: {
    colonies: ImmutableMap<ENSName, ColonyRecord>,
  },
};

type CurrentColonySelector = (state: RootState, props: Object) => ColonyRecord;

export const getCurrentColony: CurrentColonySelector = createSelector(
  allColonies,
  props => props.colony.ensName,
  (colonies, ensName) => colonies.get(ensName),
);
