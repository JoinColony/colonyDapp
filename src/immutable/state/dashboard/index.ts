import {
  Collection as CollectionType,
  List as ListType,
  Map as ImmutableMapType,
  RecordOf,
} from 'immutable';

import { Address } from '~types/index';
import { AllColoniesRecord } from './AllColonies';
import { AllDomainsMap } from './AllDomains';
import { AllRolesMap } from './AllRoles';
import { AllTokensMap } from './AllTokens';
import { FetchableDataRecord } from '../../FetchableData';
import { TaskCommentRecord } from '../../TaskComment';
import { TaskDraftId, TaskRecord } from '../../Task';
import { TaskFeedItemRecordType } from '../../TaskFeedItem';
import { TaskMetadataRecordType } from '../../TaskMetadata';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';
export * from './AllRoles';

export type CommentsList = ListType<TaskCommentRecord>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type TaskMetadataMap = ImmutableMapType<
  TaskDraftId,
  TaskMetadataRecordType
>;

export type AllTaskMetadataMap = ImmutableMapType<
  Address,
  FetchableDataRecord<TaskMetadataMap | null>
>;

export type TasksMap = ImmutableMapType<
  TaskDraftId,
  FetchableDataRecord<TaskRecord | null>
>;

export type TaskFeedItemsMap = ImmutableMapType<
  TaskDraftId,
  FetchableDataRecord<ListType<TaskFeedItemRecordType>>
>;

export type DashboardStateProps = {
  allColonies: AllColoniesRecord;
  allComments: AllCommentsMap;
  allDomains: AllDomainsMap;
  allRoles: AllRolesMap;
  allTaskMetadata: AllTaskMetadataMap;
  allTokens: AllTokensMap;
  taskFeedItems: TaskFeedItemsMap;
  tasks: TasksMap;
};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<any, any> &
  RecordOf<DashboardStateProps>;
