/* eslint-disable camelcase */
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { FetchableData } from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';
import { Address } from '~types/index';

import { TEMP_AllUserHasRecoveryRoles } from '../state/index';

const allDomainsReducer: ReducerType<TEMP_AllUserHasRecoveryRoles> = (
  state = ImmutableMap() as TEMP_AllUserHasRecoveryRoles,
  action,
) => {
  switch (action.type) {
    case ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH_SUCCESS: {
      const {
        payload: { colonyAddress, userAddress, userHasRecoveryRole },
      } = action;

      if (!userHasRecoveryRole) {
        if (state.getIn([colonyAddress, 'record'])) {
          return state.updateIn([colonyAddress, 'record'], set =>
            set.remove(userAddress),
          );
        }
        return state;
      }

      if (state.getIn([colonyAddress, 'record'])) {
        return state.updateIn([colonyAddress, 'record'], set =>
          set.add(userAddress),
        );
      }

      return state.set(
        colonyAddress,
        FetchableData({
          record: ImmutableSet([userAddress]),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<
  TEMP_AllUserHasRecoveryRoles,
  ImmutableSet<Address>
>(
  ActionTypes.COLONY_DOMAINS_FETCH,
  ImmutableMap() as TEMP_AllUserHasRecoveryRoles,
)(allDomainsReducer);
