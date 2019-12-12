import { Map as ImmutableMap } from 'immutable';
import BigNumber from 'bn.js';

import {
  Colony,
  ColonyRecord,
  FetchableData,
  ColonyTokenReference,
  ColonyTokenReferenceRecord,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';
import { createAddress } from '~types/index';

import { AllColoniesMap } from '../state/index';

/**
 * Convert a JS object of balances { 1: '...' } where keys may be number or
 * string, to an ImmutableMap of balances keyed by numbers.
 */
const balancesMapFromObject = (balances) =>
  ImmutableMap(
    Object.entries(balances).map(([domainId, balance]) => [
      domainId,
      balance as BigNumber,
    ]) || [],
  ) as ColonyTokenReferenceRecord['balances'];

const coloniesReducer: ReducerType<AllColoniesMap> = (
  state = ImmutableMap() as AllColoniesMap,
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
            ColonyTokenReference({
              ...token,
              balances: balancesMapFromObject(token.balances),
            }),
          ]),
        ),
      });
      return state.get(colonyAddress)
        ? state.setIn([colonyAddress, 'record'], record)
        : state.set(colonyAddress, FetchableData<ColonyRecord>({ record }));
    }
    case ActionTypes.COLONY_TOKEN_BALANCE_FETCH_SUCCESS: {
      const {
        payload: { colonyAddress, tokenAddress, token: tokenObject },
      } = action;
      const previousRecord = state.getIn([
        colonyAddress,
        'record',
        'tokens',
        tokenAddress,
      ]);
      const token = {
        ...tokenObject,
        balances: balancesMapFromObject(tokenObject.balances),
      };
      const record = previousRecord
        ? previousRecord.mergeDeep(token)
        : ColonyTokenReference(token);
      return state.setIn(
        [colonyAddress, 'record', 'tokens', tokenAddress],
        record,
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<AllColoniesMap, ColonyRecord>(
  new Set([ActionTypes.COLONY_FETCH]),
  ImmutableMap() as AllColoniesMap,
)(coloniesReducer);
