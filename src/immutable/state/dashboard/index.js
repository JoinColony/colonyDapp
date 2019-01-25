/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { ENSName } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { DataRecord } from '../../Data';
import type { DomainId, DomainRecord } from '../../Domain';
import type { DraftId, DraftRecord } from '../../Draft';
import type { TaskRecord } from '../../Task';

export * from './AllColonies';

export type DomainsMap = ImmutableMapType<DomainId, DataRecord<DomainRecord>>;
export type AllDomainsMap = ImmutableMapType<ENSName, DomainsMap>;
export type DraftsMap = ImmutableMapType<DraftId, DataRecord<DraftRecord>>;
export type AllDraftsMap = ImmutableMapType<ENSName, DraftsMap>;
export type TasksMap = ImmutableMapType<string, TaskRecord>;
export type AllTasksMap = ImmutableMapType<ENSName, TasksMap>;

export type DashboardStateProps = {|
  allColonies: AllColoniesRecord,
  allDomains: AllDomainsMap,
  allDrafts: AllDraftsMap,
  allTasks: AllTasksMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
// $FlowFixMe
export type DashboardStateRecord = RecordOf<DashboardStateProps>;
