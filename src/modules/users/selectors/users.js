/* @flow */

// import { createSelector } from 'reselect';

import ns from '../namespace';

import type { UsersRecord } from '~types/UsersRecord';

type State = { [typeof ns]: { users: UsersRecord } };

type UsersSelector = (state: State) => UsersRecord;

// eslint-disable-next-line import/prefer-default-export
export const allUsers: UsersSelector = state => state[ns].users.users;

// TODO add selectors based on `allUsers` as needed (with `reselect`)
