/* @flow */

// import { createSelector } from 'reselect';

import ns from '../namespace';

import type { UserProfilesRecord } from '~types/UserProfilesRecord';

type State = { [typeof ns]: { userProfiles: UserProfilesRecord } };

type UserProfilesSelector = (state: State) => UserProfilesRecord;

// eslint-disable-next-line import/prefer-default-export
export const allUserProfiles: UserProfilesSelector = state =>
  state[ns].userProfiles;

// TODO add selectors based on `allUserProfiles` as needed (with `reselect`)
