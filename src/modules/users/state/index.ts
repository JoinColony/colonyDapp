import { Record } from 'immutable';

import { AllUsersRecord } from './AllUsers';
import { CurrentUserRecord } from './CurrentUser';
import { WalletRecord } from '~immutable/index';

export * from './AllUsers';
export * from './CurrentUser';

export interface UsersStateProps {
  allUsers: AllUsersRecord;
  currentUser: CurrentUserRecord;
  wallet: WalletRecord;
}

export class UsersStateRecord extends Record<UsersStateProps>({
  allUsers: new AllUsersRecord(),
  currentUser: new CurrentUserRecord(),
  wallet: new WalletRecord(),
}) {}
