/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { Map as ImmutableMap, fromJS } from 'immutable';

import type { KeyPath } from '~types';

import { DataRecord } from '../../immutable';
import type { DataRecordType } from '../../immutable';
import type { ActionTypeString } from '~redux/types/actions';

export type DataReducer<S: ImmutableMapType<*, *>> = (state: S, action: *) => S;

const getNextState = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  keyPath: KeyPath,
  payload: $Shape<DataRecordType<V>>,
) => {
  const immutablePayload: typeof payload = fromJS(payload);
  const data = DataRecord<V>(immutablePayload);

  if (keyPath.length === 2)
    return state.has(keyPath[0])
      ? state.mergeDeepIn(keyPath, immutablePayload)
      : state.set(keyPath[0], ImmutableMap([[keyPath[1], data]]));

  return state.has(keyPath[0])
    ? state.mergeDeepIn(keyPath, immutablePayload)
    : state.set(keyPath[0], data);
};

const handleFetch = <S: ImmutableMapType<*, *>, V: *>(state: S, action: *) => {
  const {
    meta: { keyPath },
  } = action;
  return getNextState<S, V>(state, keyPath, { isFetching: true });
};

const handleSuccess = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  action: *,
) => {
  const {
    meta: { keyPath },
  } = action;
  return getNextState<S, V>(state, keyPath, {
    error: undefined,
    isFetching: false,
  });
};

const handleError = <S: ImmutableMapType<*, *>, V: *>(
  state: S,
  { meta: { keyPath }, payload: error }: *,
) =>
  getNextState<S, V>(state, keyPath, {
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
const withDataReducer = <S: ImmutableMapType<*, *>, V: *>(
  actionTypes: ActionTypeString | Set<ActionTypeString>,
  initialState: S,
) => (wrappedReducer: DataReducer<S>) => {
  // Set up fetch/success/error types according to the usual pattern
  const fetchTypes =
    typeof actionTypes === 'string' ? new Set([actionTypes]) : actionTypes;
  const successTypes = new Set(
    [...fetchTypes.values()].map(type => `${type}_SUCCESS`),
  );
  const errorTypes = new Set(
    [...fetchTypes.values()].map(type => `${type}_ERROR`),
  );

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

export default withDataReducer;
