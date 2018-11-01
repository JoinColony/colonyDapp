/* @flow */

// import { createSelector } from 'reselect';

import ns from '../namespace';

import type { Users, UsersRecord } from '~types/UsersRecord';

type State = { [typeof ns]: { users: UsersRecord } };

type UsersSelector = (state: State) => Users;

// eslint-disable-next-line import/prefer-default-export
export const allUsers: UsersSelector = state => state[ns].users.users;

// TODO add selectors based on `allUsers` as needed (with `reselect`)
