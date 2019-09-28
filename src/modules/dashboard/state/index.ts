import { List, Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';
import {
  FetchableDataRecord,
  TaskDraftId,
  TaskRecord,
  TaskFeedItemRecord,
  TaskMetadataRecord,
  FetchableDataType,
  TaskMetadataRecordProps,
  TaskType,
  TaskFeedItemType,
} from '~immutable/index';

import { AllColoniesRecord } from './AllColonies';
import { AllDomainsMap } from './AllDomains';
import { AllTokensMap, AllTokensInitialState } from './AllTokens';
import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_ALL_DOMAINS,
  DASHBOARD_TASK_METADATA,
  DASHBOARD_ALL_TOKENS,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASKS,
} from '../constants';

export * from './AllColonies';
export * from './AllTokens';
export * from './AllDomains';

type TaskMetadataObject = { [draftId: string]: TaskMetadataRecord };

export type TaskMetadataMap = ImmutableMap<TaskDraftId, TaskMetadataRecord> & {
  toJS(): TaskMetadataObject;
};

type AllTaskMetadataObject = {
  [colonyAddress: string]: FetchableDataType<TaskMetadataRecordProps>;
};

export type AllTaskMetadataMap = ImmutableMap<
  Address,
  FetchableDataRecord<TaskMetadataMap>
> & { toJS(): AllTaskMetadataObject };

type TasksObject = { [draftId: string]: FetchableDataType<TaskType> };

export type TasksMap = ImmutableMap<
  TaskDraftId,
  FetchableDataRecord<TaskRecord>
> & { toJS(): TasksObject };

type TaskFeedItemsObject = {
  [draftId: string]: FetchableDataType<TaskFeedItemType[]>;
};

type TaskFeedItemsList = List<TaskFeedItemRecord> & {
  toJS(): TaskFeedItemType[];
};

export type TaskFeedItemsMap = ImmutableMap<
  TaskDraftId,
  FetchableDataRecord<TaskFeedItemsList>
> & { toJS(): TaskFeedItemsObject };

export interface DashboardStateProps {
  [DASHBOARD_ALL_COLONIES]: AllColoniesRecord;
  [DASHBOARD_ALL_DOMAINS]: AllDomainsMap;
  [DASHBOARD_TASK_METADATA]: AllTaskMetadataMap;
  [DASHBOARD_ALL_TOKENS]: AllTokensMap;
  [DASHBOARD_TASK_FEED_ITEMS]: TaskFeedItemsMap;
  [DASHBOARD_TASKS]: TasksMap;
}

const defaultValues: DefaultValues<DashboardStateProps> = {
  [DASHBOARD_ALL_COLONIES]: new AllColoniesRecord(),
  [DASHBOARD_ALL_DOMAINS]: ImmutableMap() as AllDomainsMap,
  [DASHBOARD_TASK_METADATA]: ImmutableMap() as AllTaskMetadataMap,
  [DASHBOARD_ALL_TOKENS]: AllTokensInitialState,
  [DASHBOARD_TASK_FEED_ITEMS]: ImmutableMap() as TaskFeedItemsMap,
  [DASHBOARD_TASKS]: ImmutableMap() as TasksMap,
};

export class DashboardStateRecord extends Record<DashboardStateProps>(
  defaultValues,
) {}
