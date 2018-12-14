/* @flow */

import { createSelector } from 'reselect';

import type { ColonyRecord } from '~immutable';

type RootState = {
  dashboard: {
    colonies: Map<ColonyRecord>,
  },
};

type ColonyAvatarSelector = (state: RootState, props: Object) => string;

export const currentColonyAvatarSelector: ColonyAvatarSelector = createSelector(
  state => state.dashboard.colonies,
  (state, props) => props.ensName,
  (colonies, ensName) => {
    const currentColony = colonies.get(ensName) || {};
    return currentColony.avatar || undefined;
  },
);

export default currentColonyAvatarSelector;
