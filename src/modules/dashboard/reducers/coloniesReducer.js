/* @flow */

import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_FETCH,
  COLONY_FETCH_SUCCESS,
  COLONY_PROFILE_UPDATE_SUCCESS,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_REMOVE_SUCCESS,
} from '../actionTypes';

import { Colony, Data, Token } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { AllColoniesMap, ColonyRecord } from '~immutable';
import type { UniqueActionWithKeyPath } from '~types';

const coloniesReducer = (
  state: AllColoniesMap = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        payload: { token, ensName, admins, ...props },
      } = action;
      const record = Colony({
        token: Token(token),
        admins: ImmutableMap(admins),
        ensName,
        ...props,
      });
      return state.get(ensName)
        ? state.setIn([ensName, 'record'], record)
        : state.set(ensName, Data<ColonyRecord>({ record }));
    }
    case COLONY_PROFILE_UPDATE_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      // fromJS is `mixed`, so we have to cast `any`
      const props: any = fromJS(payload);
      return state.mergeDeepIn([...keyPath, 'record'], props);
    }
    case COLONY_AVATAR_UPLOAD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: hash,
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], hash);
    }
    case COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], undefined);
    }
    case COLONY_ADMIN_ADD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: adminData,
      } = action;
      return state
        ? state.setIn(
            [...keyPath, 'record', 'admins', adminData.username],
            adminData.toObject(),
          )
        : state;
    }
    case COLONY_ADMIN_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
        payload: username,
      } = action;
      return state
        ? state.deleteIn([...keyPath, 'record', 'admins', username])
        : state;
    }
    default:
      return state;
  }
};

export default withDataReducer<AllColoniesMap, ColonyRecord>(
  COLONY_FETCH,
  ImmutableMap(),
)(coloniesReducer);
