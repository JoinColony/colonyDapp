/* @flow */
import type { ContractTransactionType, TaskType } from '~immutable';

type CommonProps = {|
  transaction: ContractTransactionType,
|};

export type InProps = {|
  ...CommonProps,
  task: TaskType,
|};

export type EnhancedProps = {|
  ...CommonProps,
  reputation: number,
|};
