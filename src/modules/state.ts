import { Record } from 'immutable';

import { ADMIN_NAMESPACE } from './admin/constants';
import { AdminStateRecord } from './admin/state/index';
import { CORE_NAMESPACE } from './core/constants';
import { CoreStateRecord } from './core/state/index';
import { USERS_NAMESPACE } from './users/constants';
import { UsersStateRecord } from './users/state/index';

export interface RootStateProps {
  admin: AdminStateRecord;
  core: CoreStateRecord;
  users: UsersStateRecord;
}

export class RootStateRecord extends Record<RootStateProps>({
  [ADMIN_NAMESPACE]: new AdminStateRecord(),
  [CORE_NAMESPACE]: new CoreStateRecord(),
  [USERS_NAMESPACE]: new UsersStateRecord(),
}) {}
