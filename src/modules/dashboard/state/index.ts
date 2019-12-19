import { Map as ImmutableMap, Record } from 'immutable';

import { AnyTask } from '~data/index';
import { Address, DefaultValues } from '~types/index';
import {
  FetchableDataRecord,
  TaskMetadataRecord,
  FetchableDataType,
  TaskMetadataRecordProps,
} from '~immutable/index';

import { AllDomainsMap } from './AllDomains';
import { TEMP_AllUserHasRecoveryRoles } from './TEMP_AllUserHasRecoveryRoles';
import {
  DASHBOARD_ALL_DOMAINS,
  TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES,
} from '../constants';

export * from './AllDomains';
export * from './TEMP_AllUserHasRecoveryRoles';

type TaskMetadataObject = { [draftId: string]: TaskMetadataRecord };

export type TaskMetadataMap = ImmutableMap<
  AnyTask['id'],
  TaskMetadataRecord
> & {
  toJS(): TaskMetadataObject;
};

type AllTaskMetadataObject = {
  [colonyAddress: string]: FetchableDataType<TaskMetadataRecordProps>;
};

export type AllTaskMetadataMap = ImmutableMap<
  Address,
  FetchableDataRecord<TaskMetadataMap>
> & { toJS(): AllTaskMetadataObject };

export interface DashboardStateProps {
  [DASHBOARD_ALL_DOMAINS]: AllDomainsMap;
  [TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES]: TEMP_AllUserHasRecoveryRoles;
}

const defaultValues: DefaultValues<DashboardStateProps> = {
  [DASHBOARD_ALL_DOMAINS]: ImmutableMap() as AllDomainsMap,
  // eslint-disable-next-line max-len
  [TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES]: ImmutableMap() as TEMP_AllUserHasRecoveryRoles,
};

export class DashboardStateRecord extends Record<DashboardStateProps>(
  defaultValues,
) {}
