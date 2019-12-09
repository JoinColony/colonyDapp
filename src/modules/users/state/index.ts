import { Record } from 'immutable';

import { WalletRecord } from '~immutable/index';

import { CurrentUserRecord } from './CurrentUser';
import { USERS_CURRENT_USER, USERS_WALLET } from '../constants';

export * from './CurrentUser';

interface UsersStateProps {
  [USERS_CURRENT_USER]: CurrentUserRecord;
  [USERS_WALLET]: WalletRecord;
}

export class UsersStateRecord extends Record<UsersStateProps>({
  [USERS_CURRENT_USER]: new CurrentUserRecord(),
  [USERS_WALLET]: new WalletRecord(),
}) {}
