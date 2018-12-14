/* @flow */

import { createSelector } from 'reselect';

import type { ColonyRecord } from '~immutable';

type RootState = {
  dashboard: {
    colonies: Map<ColonyRecord>,
  },
};

type ColonyAvatarSelector = (state: RootState, props: Object) => string;

export const currentColonyAvatarHashSelector: ColonyAvatarSelector = createSelector(
  state => state.dashboard.colonies,
  (state, props) => props.ensName,
  (colonies, ensName) => {
    const currentColony = colonies.get(ensName) || {};
    return currentColony.avatar || undefined;
  },
);

export const currentColonyAvatarDataSelector: ColonyAvatarSelector = createSelector(
  currentColonyAvatarHashSelector,
  state => state.dashboard.colonies,
  (hash, colonies) => {
    const coloniesAvatars = colonies.get('avatars');
    if (coloniesAvatars && coloniesAvatars.size) {
      return coloniesAvatars.get(hash);
    }
    return undefined;
  },
);
