/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export type ColonyTransactionProps = {
  type: 'incoming' | 'outgoing',
  from?: Address,
  to?: Address,
  token?: Address,
  taskId?: number,
};

export type ColonyTransactionRecord = RecordOf<ColonyTransactionProps>;

const defaultValues: ColonyTransactionProps = {
  type: 'incoming',
  from: undefined,
  to: undefined,
  token: undefined,
  taskId: undefined,
};

const ColonyTransaction: RecordFactory<ColonyTransactionProps> = Record(
  defaultValues,
);

export default ColonyTransaction;
