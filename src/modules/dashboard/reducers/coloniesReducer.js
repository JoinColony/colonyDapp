/* @flow */

import { Map as ImmutableMap, fromJS } from 'immutable';

import { ColonyRecord, DataRecord, TokenReferenceRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllColoniesMap, ColonyRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const coloniesReducer: ReducerType<
  AllColoniesMap,
  {|
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
        payload: { tokens, colonyAddress, ...colony },
      } = action;
      const record = ColonyRecord({
        ...colony,
        colonyAddress,
        tokens: ImmutableMap(
          Object.entries(tokens).map(([tokenAddress, token]) => [
            tokenAddress,
            TokenReferenceRecord(token),
          ]),
        ),
      });
      return state.get(colonyAddress)
        ? state.setIn([colonyAddress, 'record'], record)
        : state.set(colonyAddress, DataRecord<ColonyRecordType>({ record }));
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
      return state.setIn([...keyPath, 'record', 'avatarHash'], hash);
    }
    case ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
      } = action;
      return state.setIn([...keyPath, 'record', 'avatarHash'], undefined);
    }
    case ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS: {
      const {
        payload: { colonyAddress, tokenAddress, token },
      } = action;
      const previousRecord = state.getIn([
        colonyAddress,
        'record',
        'tokens',
        tokenAddress,
      ]);
      const record = previousRecord
        ? previousRecord.merge(token)
        : TokenReferenceRecord(token);
      return state.setIn(
        [colonyAddress, 'record', 'tokens', tokenAddress],
        record,
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
