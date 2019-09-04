import { RecordOf, Record } from 'immutable';
import { RouterState } from 'connected-react-router';

import { AdminStateRecord } from './admin';
import { CoreStateRecord } from './core';
import { DashboardStateRecord } from './dashboard';
import { UsersStateRecord } from './users';
import { ADMIN_NAMESPACE } from '../../modules/admin/constants';
import { CORE_NAMESPACE } from '../../modules/core/constants';
import { DASHBOARD_NAMESPACE } from '../../modules/dashboard/constants';
import { USERS_NAMESPACE } from '../../modules/users/constants';

export * from './admin';
export * from './core';
export * from './dashboard';
export * from './users';

export interface RootStateProps {
  admin?: AdminStateRecord;
  core?: CoreStateRecord;
  dashboard?: DashboardStateRecord;
  router?: RouterState;
  users?: UsersStateRecord;
  watcher: any;
}

const defaultValues: RootStateProps = {
  [ADMIN_NAMESPACE]: undefined,
  [CORE_NAMESPACE]: undefined,
  [DASHBOARD_NAMESPACE]: undefined,
  [USERS_NAMESPACE]: undefined,
  router: undefined,
  watcher: undefined,
};

export const RootState: Record.Factory<RootStateProps> = Record(defaultValues);

export type RootStateRecord = RecordOf<RootStateProps>;

export default RootState;
