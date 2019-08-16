import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  CurrentUserPermissionsType,
  UserPermissionsRecordType,
  UserPermissionsRecord,
  DataRecord,
} from '~immutable/index';

import { withDataRecordMap } from '~utils/reducers';
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
        DataRecord<UserPermissionsRecordType>({
          record: UserPermissionsRecord(fromJS(permissions)),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<
  CurrentUserPermissionsType,
  UserPermissionsRecordType
>(ActionTypes.USER_PERMISSIONS_FETCH, ImmutableMap())(userPermissionsReducer);
