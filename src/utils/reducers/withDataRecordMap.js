/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { fromJS } from 'immutable';

import { DataRecord } from '../../immutable';
import type { DataRecordType } from '../../immutable';
import type { ActionTypeString } from '~redux/types/actions';
import { getActionTypes } from './utils';

export type DataReducer<S: ImmutableMapType<*, *>> = (state: S, action: *) => S;

const getNextState = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  key: string,
  payload: $Shape<DataRecordType<V>>,
) => {
  const immutablePayload: typeof payload = fromJS(payload);
  const data = DataRecord<V>(immutablePayload);

  return state.has(key)
    ? state.mergeDeepIn([key], immutablePayload)
    : state.set(key, data);
};

const handleFetch = <S: ImmutableMapType<*, *>, V: *>(state: S, action: *) => {
  const {
    meta: { key },
  } = action;
  return getNextState<S, V>(state, key, { isFetching: true });
};

const handleSuccess = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  action: *,
) => {
  const {
    meta: { key },
  } = action;
  return getNextState<S, V>(state, key, {
    error: undefined,
    isFetching: false,
    lastFetchedAt: new Date(),
  });
};

const handleError = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  { meta: { key }, payload: error }: *,
) =>
  getNextState<S, V>(state, key, {
    isFetching: false,
    error: error.message || error.toString(),
  });

/*
 * =============================================================================
 * Higher-order reducer to create a map of records with information about
 * the loading state of each record: whether it is isFetching, any
 * isFetching error, and the data currently loaded.
 *
 * -----------------------------------------------------------------------------
 * Parameters (higher order function)
 * -----------------------------------------------------------------------------
 * {actionTypes} A single action type (or a `Set` of multiple types) that will
 * be handled as generic fetch action(s). This action type assumes that there
 * will be an error action type with the suffix `_ERROR` and a success action
 * type with the suffix `_SUCCESS` (e.g. `COLONY_FETCH_SUCCESS`).
 *
 * -----------------------------------------------------------------------------
 * Parameters (inner function)
 * -----------------------------------------------------------------------------
 * {wrappedReducer} The reducer we are wrapping.
 *
 * -----------------------------------------------------------------------------
 * Generics
 * -----------------------------------------------------------------------------
 * {S} The state this reducer handles, e.g. `ImmutableMapType<ENSName, DataRecord<ColonyRecord>>`
 *
 * {V} The value wrapped in the data record, e.g. `ColonyRecord` or `ListType<TransationRecord>`
 */
const withDataRecordMap = <S: ImmutableMapType<*, *>, V: *>(
  actionTypes: ActionTypeString | Set<ActionTypeString>,
  initialState: S,
  /*
   * @todo Remove initialState arg for `withDataRecordMap.
   */
) => (wrappedReducer: DataReducer<S>) => {
  const { fetchTypes, successTypes, errorTypes } = getActionTypes(actionTypes);

  // Return a wrapped reducer.
  return (state: S = initialState, action: *) => {
    // Pass the state to the wrapped reducer as the first step.
    const nextState = wrappedReducer(state, action);

    // If the action matches a fetch/success/error type, set the next state again.
    const { type } = action;
    if (fetchTypes.has(type)) return handleFetch<S, V>(nextState, action);
    if (successTypes.has(type)) return handleSuccess<S, V>(nextState, action);
    if (errorTypes.has(type)) return handleError<S, V>(nextState, action);

    return nextState;
  };
};

export default withDataRecordMap;
