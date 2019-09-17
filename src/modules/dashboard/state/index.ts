import { List as ListType, Map as ImmutableMap, Record } from 'immutable';

import { Address } from '~types/index';
import {
  FetchableDataRecord,
  TaskDraftId,
  TaskRecord,
  TaskFeedItemRecord,
  TaskMetadataRecord,
} from '~immutable/index';

import { AllColoniesRecord } from './AllColonies';
import { AllDomainsMap } from './AllDomains';
import { AllRolesMap } from './AllRoles';
import { AllTokensMap } from './AllTokens';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';
export * from './AllRoles';

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
  allDomains: AllDomainsMap;
  allRoles: AllRolesMap;
  taskMetadata: AllTaskMetadataMap;
  allTokens: AllTokensMap;
  taskFeedItems: TaskFeedItemsMap;
  tasks: TasksMap;
};

export class DashboardStateRecord extends Record<DashboardStateProps>({
  allColonies: new AllColoniesRecord(),
  allDomains: ImmutableMap(),
  allRoles: ImmutableMap(),
  taskMetadata: ImmutableMap(),
  allTokens: ImmutableMap(),
  taskFeedItems: ImmutableMap(),
  tasks: ImmutableMap(),
}) {}
