import { Record } from 'immutable';

import { ADMIN_NAMESPACE } from './admin/constants';
import { AdminStateRecord } from './admin/state/index';
import { CORE_NAMESPACE } from './core/constants';
import { CoreStateRecord } from './core/state/index';

export interface RootStateProps {
  admin: AdminStateRecord;
  core: CoreStateRecord;
}

export class RootStateRecord extends Record<RootStateProps>({
  [ADMIN_NAMESPACE]: new AdminStateRecord(),
  [CORE_NAMESPACE]: new CoreStateRecord(),
}) {}
