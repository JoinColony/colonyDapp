/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { Map as ImmutableMapType } from 'immutable';

import type { Address, ENSName } from '~types';
import type {
  ColonyRecord,
  DataRecord,
  DomainId,
  DomainRecord,
  TaskId,
  TaskRecord,
} from '~immutable';

import ns from './namespace';

export type ColoniesMap = ImmutableMapType<ENSName, DataRecord<ColonyRecord>>;

export type ColonyAvatarsMap = ImmutableMapType<string, string>;

export type AllColoniesState = {
  colonies: ColoniesMap,
  avatars: ColonyAvatarsMap,
  ensNames: ImmutableMapType<Address, ENSName>,
};

export type DomainsMap = ImmutableMapType<DomainId, DataRecord<DomainRecord>>;

export type AllDomainsState = ImmutableMapType<ENSName, DomainsMap>;

export type TasksMap = ImmutableMapType<TaskId, DataRecord<TaskRecord>>;

export type AllTasksState = ImmutableMapType<ENSName, TasksMap>;

export type DashboardState = {|
  [typeof ns]: {|
    allColonies: AllColoniesState,
    allDomains: AllDomainsState,
    allTasks: AllTasksState,
  |},
|};
