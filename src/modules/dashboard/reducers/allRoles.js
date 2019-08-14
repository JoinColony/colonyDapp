/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { DataRecord } from '~immutable';
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
        meta: { key },
        payload: roles,
      } = action;
      const record = ImmutableMap(
        Object.entries(roles).map(([domainId, domainRoles]) => [
          parseInt(domainId, 10),
          ImmutableMap(
            Object.entries(domainRoles).map(([userAddress, userRoles]) => [
              userAddress,
              ImmutableMap(Object.entries(userRoles)),
            ]),
          ),
        ]),
      );
      return state.get(key)
        ? state.mergeIn([key, 'record'], record)
        : state.set(
            key,
            DataRecord({
              record,
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
