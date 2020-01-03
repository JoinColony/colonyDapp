import { Record } from 'immutable';

import { FetchableData } from '~immutable/index';
import { FetchableContractTransactionList } from '../../admin/state/index';

import { USERS_CURRENT_USER_TRANSACTIONS } from '../constants';

interface CurrentUserProps {
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableContractTransactionList;
}

export class CurrentUserRecord extends Record<CurrentUserProps>({
  // eslint-disable-next-line max-len
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableData() as FetchableContractTransactionList,
}) {}
