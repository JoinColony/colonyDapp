import { Record } from 'immutable';

import { WalletRecord } from '~immutable/index';

import { AllUsersRecord } from './AllUsers';
import { CurrentUserRecord } from './CurrentUser';
import {
  USERS_ALL_USERS,
  USERS_CURRENT_USER,
  USERS_WALLET,
} from '../constants';

export * from './AllUsers';
export * from './CurrentUser';

export interface UsersStateProps {
  [USERS_ALL_USERS]: AllUsersRecord;
  [USERS_CURRENT_USER]: CurrentUserRecord;
  [USERS_WALLET]: WalletRecord;
}

export class UsersStateRecord extends Record<UsersStateProps>({
  [USERS_ALL_USERS]: new AllUsersRecord(),
  [USERS_CURRENT_USER]: new CurrentUserRecord(),
  [USERS_WALLET]: new WalletRecord(),
}) {}
