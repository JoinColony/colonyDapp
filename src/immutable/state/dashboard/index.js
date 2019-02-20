/* @flow */

import type {
  Collection as CollectionType,
  Map as ImmutableMapType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { AllTokensRecord } from './AllTokens';
import type { DataRecordType } from '../../Data';
import type { DomainId, DomainRecordType } from '../../Domain';
import type { TaskCommentRecordType } from '../../TaskComment';
import type { TaskDraftId, TaskRecordType } from '../../Task';

export * from './AllColonies';
export * from './AllTokens';

export type DomainsMap = ImmutableMapType<
  DomainId,
  DataRecordType<DomainRecordType>,
>;
export type AllDomainsMap = ImmutableMapType<
  ENSName,
  DataRecordType<DomainsMap>,
>;
export type TasksMap = ImmutableMapType<string, TaskRecordType>;
export type AllTasksMap = ImmutableMapType<ENSName, TasksMap>;
export type CommentsList = ListType<TaskCommentRecordType>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type DashboardStateProps = {|
  allColonies: AllColoniesRecord,
  allComments: AllCommentsMap,
  allDomains: AllDomainsMap,
  allTasks: AllTasksMap,
  allTokens: AllTokensRecord,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<*, *> &
  RecordOf<DashboardStateProps>;
