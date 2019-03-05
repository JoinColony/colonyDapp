/* @flow */

import { userColonyPermissionsSelector } from './selectors';
import { fetchColonyPermissions } from './actionCreators';

// eslint-disable-next-line import/prefer-default-export
export const colonyPermissionsFetcher = {
  select: userColonyPermissionsSelector,
  fetch: fetchColonyPermissions,
};
