import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AllRolesMap } from '../state/index';

const allRolesReducer: ReducerType<AllRolesMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_ROLES_FETCH_SUCCESS: {
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
        : state.setIn([key, 'record'], record);
    }
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_SET: {
      const {
        payload: { colonyAddress, domainId, userAddress },
      } = action;
      const record = ImmutableMap([['pending', true]]);
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
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS:
    case ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS: {
      const {
        payload: { roles, colonyAddress, domainId, userAddress },
      } = action;
      const record = ImmutableMap([
        ['pending', false],
        ...Object.entries(roles),
      ]);
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

export default withFetchableDataMap<AllRolesMap, ImmutableSet<string>>(
  new Set([
    ActionTypes.COLONY_ROLES_FETCH,
    ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS,
  ]),
  ImmutableMap(),
)(allRolesReducer);
