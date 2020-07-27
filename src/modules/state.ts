import { Record } from 'immutable';

import { CORE_NAMESPACE } from './core/constants';
import { CoreStateRecord } from './core/state/index';
import { USERS_NAMESPACE } from './users/constants';
import { UsersStateRecord } from './users/state/index';

export interface RootStateProps {
  core: CoreStateRecord;
  users: UsersStateRecord;
}

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_NAMESPACE]: new CoreStateRecord(),
  [USERS_NAMESPACE]: new UsersStateRecord(),
}) {}
