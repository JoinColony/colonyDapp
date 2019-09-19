import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  Colony,
  ColonyRecord,
  FetchableData,
  TokenReference,
  TokenReferenceRecord,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';
import { createAddress, Address } from '~types/index';

import { AllColoniesMap } from '../state/index';

const coloniesReducer: ReducerType<AllColoniesMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_FETCH_SUCCESS: {
      const {
        payload: { tokens = {}, colonyAddress, ...colony },
      } = action;
      const record = Colony({
        ...colony,
        colonyAddress,
        tokens: ImmutableMap(
          Object.entries(tokens).map(([tokenAddress, token]) => [
            createAddress(tokenAddress),
            TokenReference(token),
          ]),
        ),
      });
      return state.get(colonyAddress)
        ? state.setIn([colonyAddress, 'record'], record)
        : state.set(colonyAddress, FetchableData<ColonyRecord>({ record }));
    }
    case ActionTypes.COLONY_PROFILE_UPDATE_SUCCESS: {
      const {
        meta: { key },
        payload,
      } = action;
      // fromJS is `mixed`, so we have to cast `any`
      const props: any = fromJS(payload);
      return state.mergeDeepIn([key, 'record'], props);
    }
    case ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS: {
      const {
        meta: { key },
        payload: { hash },
      } = action;
      return state.setIn([key, 'record', 'avatarHash'], hash);
    }
    case ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { key },
      } = action;
      return state.setIn([key, 'record', 'avatarHash'], undefined);
    }
    case ActionTypes.COLONY_TOKEN_BALANCE_FETCH_SUCCESS: {
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
        : TokenReference(token);
      return state.setIn(
        [colonyAddress, 'record', 'tokens', tokenAddress],
        record,
      );
    }
    case ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS: {
      const {
        payload: { canMintNativeToken, colonyAddress },
      } = action;
      return state.setIn(
        [colonyAddress, 'record', 'canMintNativeToken'],
        canMintNativeToken,
      );
    }
    case ActionTypes.COLONY_SUB_EVENTS: {
      const {
        payload: {
          colony: { tokens = {}, ...colony },
          colonyAddress,
        },
      } = action;
      const canMintNativeToken = state.getIn([
        colonyAddress,
        'record',
        'canMintNativeToken',
      ]);
      const previousTokens: ImmutableMap<
        Address,
        TokenReferenceRecord
      > | null = state.getIn([colonyAddress, 'record', 'tokens']);
      const record = Colony({
        canMintNativeToken,
        ...colony,
        colonyAddress,
        tokens: ImmutableMap(
          Object.entries(tokens).map(([tokenAddress, token]) => {
            const normalizedTokenAddress = createAddress(tokenAddress);

            // get any previous balance for the token, so that we don't overwrite it
            const balance = previousTokens
              ? previousTokens.getIn([normalizedTokenAddress, 'balance'])
              : undefined;

            return [
              normalizedTokenAddress,
              TokenReference({ balance, ...token }),
            ];
          }),
        ),
      });
      return state.get(colonyAddress)
        ? state
            .setIn([colonyAddress, 'record'], record)
            .setIn([colonyAddress, 'isFetching'], false)
        : state.set(colonyAddress, FetchableData<ColonyRecord>({ record }));
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<AllColoniesMap, ColonyRecord>(
  new Set([ActionTypes.COLONY_FETCH, ActionTypes.COLONY_SUB_START]),
  ImmutableMap(),
)(coloniesReducer);
