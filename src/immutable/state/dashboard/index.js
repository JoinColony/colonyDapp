/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  Map as ImmutableMapType,
  RecordOf,
} from 'immutable';

import type { Address } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { AllDomainsMap } from './AllDomains';
import type { AllRolesMap } from './AllRoles';
import type { AllTokensMap } from './AllTokens';
import type { DataRecordType } from '../../Data';
import type { TaskCommentRecordType } from '../../TaskComment';
import type { TaskDraftId, TaskRecordType } from '../../Task';
import type { TaskFeedItemRecordType } from '../../TaskFeedItem';
import type { TaskMetadataRecordType } from '../../TaskMetadata';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';
export * from './AllRoles';

export type CommentsList = ListType<TaskCommentRecordType>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type TaskMetadataMap = ImmutableMapType<
  TaskDraftId,
  TaskMetadataRecordType,
>;

export type AllTaskMetadataMap = ImmutableMapType<
  Address,
  DataRecordType<?TaskMetadataMap>,
>;

export type TasksMap = ImmutableMapType<
  TaskDraftId,
  DataRecordType<?TaskRecordType>,
>;

export type TaskFeedItemsMap = ImmutableMapType<
  TaskDraftId,
  DataRecordType<ListType<TaskFeedItemRecordType>>,
>;

export type DashboardStateProps = {|
  allColonies: AllColoniesRecord,
  allComments: AllCommentsMap,
  allDomains: AllDomainsMap,
  allRoles: AllRolesMap,
  allTaskMetadata: AllTaskMetadataMap,
  allTokens: AllTokensMap,
  taskFeedItems: TaskFeedItemsMap,
  tasks: TasksMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<*, *> &
  RecordOf<DashboardStateProps>;
