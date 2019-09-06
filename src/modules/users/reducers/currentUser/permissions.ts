import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  CurrentUserPermissionsType,
  UserPermissionsRecordType,
  UserPermissionsRecord,
  FetchableData,
} from '~immutable/index';

import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

const userPermissionsReducer: ReducerType<CurrentUserPermissionsType> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_PERMISSIONS_FETCH_SUCCESS: {
      const {
        payload: { permissions, colonyAddress },
      } = action;
      return state.mergeIn(
        [colonyAddress],
        FetchableData<UserPermissionsRecordType>({
          record: UserPermissionsRecord(fromJS(permissions)),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<
  CurrentUserPermissionsType,
  UserPermissionsRecordType
>(ActionTypes.USER_PERMISSIONS_FETCH, ImmutableMap())(userPermissionsReducer);
