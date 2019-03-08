/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import type { DataRecordType } from '../../Data';
import type { TaskDraftId } from '../../Task';
import type { TaskReferenceRecordType } from '../../TaskReference';

export type TaskRefsMap = ImmutableMapType<
  TaskDraftId,
  DataRecordType<?TaskReferenceRecordType>,
>;
