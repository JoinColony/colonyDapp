/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type {
  CurrentUserPermissionsType,
  UserPermissionsRecordType,
} from '~immutable';
import { UserPermissionsRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

const userPermissionsReducer: ReducerType<
  CurrentUserPermissionsType,
  {| USER_PERMISSIONS_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_PERMISSIONS_FETCH_SUCCESS: {
      const {
        payload: { permissions, ensName },
      } = action;
      return state.mergeIn(
        [ensName],
        DataRecord<UserPermissionsRecordType>({
          record: UserPermissionsRecord(permissions),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataReducer<
  CurrentUserPermissionsType,
  UserPermissionsRecordType,
>(ACTIONS.USER_PERMISSIONS_FETCH, ImmutableMap())(userPermissionsReducer);
