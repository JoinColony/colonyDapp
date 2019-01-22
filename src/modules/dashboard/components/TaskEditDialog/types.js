/* @flow */
import BN from 'bn.js';
import { List } from 'immutable';

import type { DialogType } from '~core/Dialog/types';
import type { TaskRecord, TokenRecord, UserRecord } from '~immutable';

export type InProps = {
  availableTokens: List<TokenRecord>,
  maxTokens?: BN,
  // @TODO: use `TaskPayoutRecord` for `payouts`
  payouts?: List<{
    token: number,
    amount: BN,
    id: string,
  }>,
  reputation?: BN,
  users: List<UserRecord>,
  task: TaskRecord,
};

export type OutProps = DialogType & // dialog props are injected
  InProps & {
    addTokenFunding: (
      values: { payouts?: Array<any> },
      helpers: () => void,
    ) => void,
    setPayload: (action: Object, payload: Object) => Object,
  };

export type FormValues = {
  assignee: UserRecord,
  payouts: Array<{ token: number, amount: string }>,
};
