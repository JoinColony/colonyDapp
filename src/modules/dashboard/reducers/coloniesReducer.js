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
        payload: {
          colony: { tokens, ensName, ...props },
        },
      } = action;
      const record = ColonyRecord({
        tokens: ImmutableMap(
          Object.entries(tokens).map(([address, token]) => [
            address,
            TokenReferenceRecord(token),
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
      return state.setIn([...keyPath, 'record', 'avatar'], hash);
    }
    case ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], undefined);
    }
    case ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, tokenAddress],
        },
        payload,
      } = action;
      const previousRecord = state.getIn([
        ensName,
        'record',
        'tokens',
        tokenAddress,
      ]);
      const record = previousRecord
        ? previousRecord.merge(payload)
        : TokenReferenceRecord(payload);
      return state.setIn([ensName, 'record', 'tokens', tokenAddress], record);
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllColoniesMap, ColonyRecordType>(
  ACTIONS.COLONY_FETCH,
  ImmutableMap(),
)(coloniesReducer);
