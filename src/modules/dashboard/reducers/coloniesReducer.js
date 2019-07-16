/* @flow */

import { Map as ImmutableMap, fromJS } from 'immutable';

import { ColonyRecord, DataRecord, TokenReferenceRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';
import { createAddress } from '~types';

import type { AllColoniesMap, ColonyRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const coloniesReducer: ReducerType<
  AllColoniesMap,
  {|
    COLONY_AVATAR_REMOVE_SUCCESS: *,
    COLONY_AVATAR_UPLOAD_SUCCESS: *,
    COLONY_FETCH: *,
    COLONY_FETCH_SUCCESS: *,
    COLONY_SUB_EVENTS: *,
    COLONY_PROFILE_UPDATE_SUCCESS: *,
    COLONY_TOKEN_BALANCE_FETCH_SUCCESS: *,
    COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS: *,
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
            createAddress(tokenAddress),
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
        meta: { key },
        payload,
      } = action;
      // fromJS is `mixed`, so we have to cast `any`
      const props: any = fromJS(payload);
      return state.mergeDeepIn([key, 'record'], props);
    }
    case ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS: {
      const {
        meta: { key },
        payload: { hash },
      } = action;
      return state.setIn([key, 'record', 'avatarHash'], hash);
    }
    case ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { key },
      } = action;
      return state.setIn([key, 'record', 'avatarHash'], undefined);
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
    case ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS: {
      const {
        payload: { canMintNativeToken, colonyAddress },
      } = action;
      return state.setIn(
        [colonyAddress, 'record', 'canMintNativeToken'],
        canMintNativeToken,
      );
    }
    case ACTIONS.COLONY_SUB_EVENTS: {
      const {
        payload: {
          colony: { tokens, ...colony },
          colonyAddress,
        },
      } = action;
      const record = ColonyRecord({
        ...colony,
        colonyAddress,
        tokens: ImmutableMap(
          Object.entries(tokens).map(([tokenAddress, token]) => [
            createAddress(tokenAddress),
            TokenReferenceRecord(token),
          ]),
        ),
      });
      return state.get(colonyAddress)
        ? state.setIn([colonyAddress, 'record'], record)
        : state.set(colonyAddress, DataRecord<ColonyRecordType>({ record }));
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllColoniesMap, ColonyRecordType>(
  new Set([ACTIONS.COLONY_FETCH, ACTIONS.COLONY_SUB_START]),
  ImmutableMap(),
)(coloniesReducer);
