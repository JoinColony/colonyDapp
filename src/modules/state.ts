import { Record } from 'immutable';
import { RouterState } from 'connected-react-router';

import { ADMIN_NAMESPACE } from './admin/constants';
import { AdminStateRecord } from './admin/state/index';
import { CORE_NAMESPACE } from './core/constants';
import { CoreStateRecord } from './core/state/index';
import { DASHBOARD_NAMESPACE } from './dashboard/constants';
import { DashboardStateRecord } from './dashboard/state/index';
import { USERS_NAMESPACE } from './users/constants';
import { UsersStateRecord } from './users/state/index';

export interface RootStateProps {
  admin: AdminStateRecord;
  core: CoreStateRecord;
  dashboard: DashboardStateRecord;
  users: UsersStateRecord;
  router?: RouterState;
  watcher: any;
}

export class RootStateRecord extends Record<RootStateProps>({
  [ADMIN_NAMESPACE]: new AdminStateRecord(),
  [CORE_NAMESPACE]: new CoreStateRecord(),
  [DASHBOARD_NAMESPACE]: new DashboardStateRecord(),
  [USERS_NAMESPACE]: new UsersStateRecord(),
  router: undefined,
  watcher: undefined,
}) {}
