/* @flow */

import type { CoreState } from '../modules/core/types';
import type { DashboardState } from '../modules/dashboard/types';
import type { UsersState } from '../modules/users/types';

export type RootState = DashboardState & CoreState & UsersState;
