/* @flow */

import type {
  Collection as CollectionType,
  Map as ImmutableMapType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { DataRecord } from '../../Data';
import type { DomainId, DomainRecord } from '../../Domain';
import type { TaskCommentRecord } from '../../TaskComment';
import type { TaskDraftId, TaskRecord } from '../../Task';

export * from './AllColonies';

export type DomainsMap = ImmutableMapType<DomainId, DataRecord<DomainRecord>>;
export type AllDomainsMap = ImmutableMapType<ENSName, DataRecord<DomainsMap>>;
export type TasksMap = ImmutableMapType<string, TaskRecord>;
export type AllTasksMap = ImmutableMapType<ENSName, TasksMap>;
export type CommentsList = ListType<TaskCommentRecord>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type DashboardStateProps = {|
  allColonies: AllColoniesRecord,
  allComments: AllCommentsMap,
  allDomains: AllDomainsMap,
  allTasks: AllTasksMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<*, *> &
  RecordOf<DashboardStateProps>;
