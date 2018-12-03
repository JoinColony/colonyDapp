/* @flow */

import { List } from 'immutable';

import MockUser from '~users/UserProfile/__datamocks__/mockUser';

const mockColonyAdmins = List.of(
  MockUser,
  MockUser,
  MockUser,
  MockUser,
  MockUser,
);

export default mockColonyAdmins;
