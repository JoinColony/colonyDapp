/* @flow */

import { fromJS, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { DataRecord, RolesRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllRolesMap } from '~immutable';
import type { ReducerType } from '~redux';

type RolesActions = {
  COLONY_ROLES_FETCH: *,
  COLONY_ROLES_FETCH_SUCCESS: *,
  COLONY_ROLES_FETCH_ERROR: *,
};

const allRolesReducer: ReducerType<AllRolesMap, RolesActions> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.COLONY_ROLES_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName],
        },
        payload: roles,
      } = action;
      return state.set(
        ensName,
        DataRecord({
          record: RolesRecord(fromJS(roles)),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllRolesMap, ImmutableSet<string>>(
  ACTIONS.COLONY_ROLES_FETCH,
  ImmutableMap(),
)(allRolesReducer);
