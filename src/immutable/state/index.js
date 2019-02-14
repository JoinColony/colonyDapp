/* @flow */

import type {
  RecordFactory,
  RecordOf,
  Collection as CollectionType,
} from 'immutable';
import type { RouterState } from 'connected-react-router';

import { Record } from 'immutable';

import type { AdminStateRecord } from './admin';
import type { CoreStateRecord } from './core';
import type { DashboardStateRecord } from './dashboard';
import type { UsersStateRecord } from './users';

import {
  ADMIN_NAMESPACE,
  CORE_NAMESPACE,
  DASHBOARD_NAMESPACE,
  USERS_NAMESPACE,
} from '~redux/misc_constants';

export * from './admin';
export * from './core';
export * from './dashboard';
export * from './users';

export type RootStateProps = {|
  admin: AdminStateRecord,
  core: CoreStateRecord,
  dashboard: DashboardStateRecord,
  users: UsersStateRecord,
  router: RouterState,
|};

const defaultValues: $Shape<RootStateProps> = {
  [ADMIN_NAMESPACE]: undefined,
  [CORE_NAMESPACE]: undefined,
  [DASHBOARD_NAMESPACE]: undefined,
  [USERS_NAMESPACE]: undefined,
  router: undefined,
};

export const RootState: RecordFactory<RootStateProps> = Record(defaultValues);

export type RootStateRecord = CollectionType<
  $Keys<RootStateProps>,
  $Values<RootStateProps>,
> &
  RecordOf<RootStateProps>;

export default RootState;
