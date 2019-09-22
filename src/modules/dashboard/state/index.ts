import { List as ListType, Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';
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
import { AllTokensMap, AllTokensInitialState } from './AllTokens';
import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_ALL_DOMAINS,
  DASHBOARD_ALL_ROLES,
  DASHBOARD_TASK_METADATA,
  DASHBOARD_ALL_TOKENS,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASKS,
} from '../constants';

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

interface DashboardStateProps {
  [DASHBOARD_ALL_COLONIES]: AllColoniesRecord;
  [DASHBOARD_ALL_DOMAINS]: AllDomainsMap;
  [DASHBOARD_ALL_ROLES]: AllRolesMap;
  [DASHBOARD_TASK_METADATA]: AllTaskMetadataMap;
  [DASHBOARD_ALL_TOKENS]: AllTokensMap;
  [DASHBOARD_TASK_FEED_ITEMS]: TaskFeedItemsMap;
  [DASHBOARD_TASKS]: TasksMap;
}

const defaultValues: DefaultValues<DashboardStateProps> = {
  [DASHBOARD_ALL_COLONIES]: new AllColoniesRecord(),
  [DASHBOARD_ALL_DOMAINS]: ImmutableMap(),
  [DASHBOARD_ALL_ROLES]: ImmutableMap(),
  [DASHBOARD_TASK_METADATA]: ImmutableMap(),
  [DASHBOARD_ALL_TOKENS]: AllTokensInitialState,
  [DASHBOARD_TASK_FEED_ITEMS]: ImmutableMap(),
  [DASHBOARD_TASKS]: ImmutableMap(),
};

export class DashboardStateRecord extends Record<DashboardStateProps>(
  defaultValues,
) {}
