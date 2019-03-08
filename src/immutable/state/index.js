/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { RouterState } from 'connected-react-router';

import { Record } from 'immutable';

import type { AdminStateRecord } from './admin';
import type { CoreStateRecord } from './core';
import type { DashboardStateRecord } from './dashboard';
import type { TaskRefsMap } from './tasks';
import type { UsersStateRecord } from './users';

import { ADMIN_NAMESPACE } from '../../modules/admin/constants';
import { CORE_NAMESPACE } from '../../modules/core/constants';
import { DASHBOARD_NAMESPACE } from '../../modules/dashboard/constants';
import { USERS_NAMESPACE } from '../../modules/users/constants';

export * from './admin';
export * from './core';
export * from './dashboard';
export * from './tasks';
export * from './users';

export type RootStateProps = {|
  admin: AdminStateRecord,
  core: CoreStateRecord,
  dashboard: DashboardStateRecord,
  router: RouterState,
  tasks: TaskRefsMap,
  users: UsersStateRecord,
|};

const defaultValues: $Shape<RootStateProps> = {
  [ADMIN_NAMESPACE]: undefined,
  [CORE_NAMESPACE]: undefined,
  [DASHBOARD_NAMESPACE]: undefined,
  tasks: undefined,
  [USERS_NAMESPACE]: undefined,
  router: undefined,
};

export const RootState: RecordFactory<RootStateProps> = Record(defaultValues);

export type RootStateRecord = RecordOf<RootStateProps>;

export default RootState;
