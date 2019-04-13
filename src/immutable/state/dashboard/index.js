/* @flow */

import type {
  Collection as CollectionType,
  Map as ImmutableMapType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { AllTokensMap } from './AllTokens';
import type { AllDomainsMap } from './AllDomains';
import type { AllRolesMap } from './AllRoles';

import type { DataRecordType } from '../../Data';
import type { TaskCommentRecordType } from '../../TaskComment';
import type { TaskDraftId, TaskRecordType } from '../../Task';
import type { TaskReferenceRecordType } from '../../TaskReference';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';
export * from './AllRoles';

export type TasksMap = ImmutableMapType<string, TaskRecordType>;
export type AllTasksMap = ImmutableMapType<ENSName, TasksMap>;
export type CommentsList = ListType<TaskCommentRecordType>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type TaskRefsMap = ImmutableMapType<
  TaskDraftId,
  DataRecordType<?TaskReferenceRecordType>,
>;

export type DashboardStateProps = {|
  allRoles: AllRolesMap,
  allColonies: AllColoniesRecord,
  allComments: AllCommentsMap,
  allDomains: AllDomainsMap,
  allTokens: AllTokensMap,
  tasks: TaskRefsMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<*, *> &
  RecordOf<DashboardStateProps>;
