import { Record } from 'immutable';

import { WalletRecord } from '~immutable/index';

import { USERS_WALLET } from '../constants';

interface UsersStateProps {
  [USERS_WALLET]: WalletRecord;
}

export class UsersStateRecord extends Record<UsersStateProps>({
  [USERS_WALLET]: new WalletRecord(),
}) {}
