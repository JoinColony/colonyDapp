/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

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
      return state.getIn([key, 'record'])
        ? state.mergeIn([key, 'record'], record)
        : // $FlowFixMe not sure why this is happening
          state.setIn([key, 'record'], record);
    }
    case ACTIONS.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS: {
      const {
        payload: { roles, colonyAddress, domainId, userAddress },
      } = action;
      // Map keys instead of doing entries to appease the type gods
      const record = ImmutableMap(
        Object.keys(roles).map(role => [role, roles[role]]),
      );
      return state.getIn([colonyAddress, 'record'])
        ? state.mergeIn(
            [colonyAddress, 'record', domainId, userAddress],
            record,
          )
        : state.setIn(
            [colonyAddress, 'record'],
            ImmutableMap([[domainId, ImmutableMap([[userAddress, record]])]]),
          );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllRolesMap, ImmutableSet<string>>(
  new Set([
    ACTIONS.COLONY_ROLES_FETCH,
    ACTIONS.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS,
  ]),
  ImmutableMap(),
)(allRolesReducer);
