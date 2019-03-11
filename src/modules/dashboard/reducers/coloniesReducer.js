/* @flow */

import { Map as ImmutableMap, fromJS } from 'immutable';

import { ColonyRecord, DataRecord, TokenReferenceRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllColoniesMap, ColonyRecordType } from '~immutable';
import type { ReducerType } from '~redux';
import ColonyAdminRecord from '~immutable/ColonyAdmin';

const coloniesReducer: ReducerType<
  AllColoniesMap,
  {|
    COLONY_ADMIN_ADD_CONFIRM_SUCCESS: *,
    COLONY_ADMIN_ADD_SUCCESS: *,
    COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS: *,
    COLONY_ADMIN_REMOVE_SUCCESS: *,
    COLONY_AVATAR_REMOVE_SUCCESS: *,
    COLONY_AVATAR_UPLOAD_SUCCESS: *,
    COLONY_FETCH: *,
    COLONY_FETCH_SUCCESS: *,
    COLONY_PROFILE_UPDATE_SUCCESS: *,
    COLONY_TOKEN_BALANCE_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_FETCH_SUCCESS: {
      const {
        payload: [{ tokens, ensName, admins = {}, ...props }],
      } = action;
      const record = ColonyRecord({
        tokens: ImmutableMap(
          Object.entries(tokens).map(([address, token]) => [
            address,
            TokenReferenceRecord(token),
          ]),
        ),
        admins: ImmutableMap(
          Object.entries(admins).map(([username, user]) => [
            username,
            ColonyAdminRecord(user),
          ]),
        ),
        ensName,
        ...props,
      });
      return state.get(ensName)
        ? state.setIn([ensName, 'record'], record)
        : state.set(ensName, DataRecord<ColonyRecordType>({ record }));
    }
    case ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      // fromJS is `mixed`, so we have to cast `any`
      const props: any = fromJS(payload);
      return state.mergeDeepIn([...keyPath, 'record'], props);
    }
    case ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { hash },
      } = action;
      // $FlowFixMe issue with keyPath
      return state.setIn([...keyPath, 'record', 'avatar'], hash);
    }
    case ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], undefined);
    }
    case ACTIONS.COLONY_ADMIN_ADD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { adminData, username },
      } = action;
      return state.setIn([...keyPath, 'record', 'admins', username], {
        ...adminData.toJS(),
        state: 'pending',
      });
    }
    case ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { username },
      } = action;
      return state.setIn(
        // $FlowFixMe
        [...keyPath, 'record', 'admins', username, 'state'],
        'confirmed',
      );
    }
    case ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { username },
      } = action;
      return state.setIn(
        // $FlowFixMe // issue with updating the admins map by value
        [...keyPath, 'record', 'admins', username, 'status'],
        'pending',
      );
    }
    case ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { username },
      } = action;
      return state.deleteIn([...keyPath, 'record', 'admins', username]);
    }
    case ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, tokenAddress],
        },
        payload,
      } = action;
      return state.mergeDeepIn(
        [ensName, 'record', 'tokens', tokenAddress],
        TokenReferenceRecord(payload),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllColoniesMap, ColonyRecordType>(
  ACTIONS.COLONY_FETCH,
  ImmutableMap(),
)(coloniesReducer);
