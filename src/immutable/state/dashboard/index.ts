import { List as ListType, Map as ImmutableMap, Record } from 'immutable';

import { Address } from '~types/index';
import { AllColoniesRecord } from './AllColonies';
import { AllDomainsMap } from './AllDomains';
import { AllRolesMap } from './AllRoles';
import { AllTokensMap } from './AllTokens';
import { FetchableDataRecord } from '../../FetchableData';
import { TaskCommentRecord } from '../../TaskComment';
import { TaskDraftId, TaskRecord } from '../../Task';
import { TaskFeedItemRecord } from '../../TaskFeedItem';
import { TaskMetadataRecord } from '../../TaskMetadata';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';
export * from './AllRoles';

export type CommentsList = ListType<TaskCommentRecord>;
export type AllCommentsMap = ImmutableMap<TaskDraftId, CommentsList>;

export type TaskMetadataMap = ImmutableMap<TaskDraftId, TaskMetadataRecord>;

export type AllTaskMetadataMap = ImmutableMap<
  Address,
  FetchableDataRecord<TaskMetadataMap | null>
>;

export type TasksMap = ImmutableMap<
  TaskDraftId,
  FetchableDataRecord<TaskRecord | null>
>;

export type TaskFeedItemsMap = ImmutableMap<
  TaskDraftId,
  FetchableDataRecord<ListType<TaskFeedItemRecord>>
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

export class DashboardStateRecord extends Record<DashboardStateProps>({
  allColonies: new AllColoniesRecord(),
  allComments: ImmutableMap(),
  allDomains: ImmutableMap(),
  allRoles: ImmutableMap(),
  allTaskMetadata: ImmutableMap(),
  allTokens: ImmutableMap(),
  taskFeedItems: ImmutableMap(),
  tasks: ImmutableMap(),
}) {}
