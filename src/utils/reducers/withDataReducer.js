/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { Action } from '~types';

import { Data } from '../../immutable';

type KeyPath = [*, *];

export type DataAction = {
  type: string,
  payload: {
    keyPath: KeyPath,
    props: any,
  } & Object,
  error?: boolean,
  meta?: any,
};

export type DataReducer<K: *, V: *> = (
  state: ImmutableMap<K, V>,
  action: DataAction,
) => ImmutableMap<K, V>;

const getNextState = <K: *, V: *>(
  state: ImmutableMap<K, V>,
  keyPath: KeyPath,
  props: *,
) => {
  const data = Data(props);

  if (keyPath.length === 2)
    return state.has(keyPath[0])
      ? state.mergeDeepIn(keyPath, props)
      : state.set(keyPath[0], ImmutableMap([[keyPath[1], data]]));

  return state.has(keyPath[0])
    ? state.mergeDeepIn(keyPath, props)
    : state.set(keyPath[0], data);
};

const handleFetch = <K: *, V: *>(
  state: ImmutableMap<K, V>,
  action: DataAction,
) => {
  const {
    payload: { keyPath },
  } = action;
  return getNextState<K, V>(state, keyPath, { isFetching: true });
};

const handleSuccess = <K: *, V: *>(
  state: ImmutableMap<K, V>,
  action: DataAction,
) => {
  const {
    payload: { keyPath },
  } = action;
  return getNextState<K, V>(state, keyPath, {
    error: undefined,
    isFetching: false,
  });
};

const handleError = <K: *, V: *>(
  state: ImmutableMap<K, V>,
  {
    payload: {
      error: { id: error },
      meta: { keyPath },
    },
  }: DataAction,
) => getNextState<K, V>(state, keyPath, { isFetching: false, error });

/*
 * =============================================================================
 * Higher-order reducer to create a map of records with information about
 * the props loading state of each record: whether it is isFetching, any
 * isFetching error, and the props currently loaded.
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
 * {K} Key of the map, e.g. `ENSName`
 *
 * {V} The value set in the map (top-level), e.g. `DataRecord<ColonyRecord>` or
 * `ImmutableMap<DomainId, DataRecord<Domain>>`
 */
const withDataReducer = <K: *, V: *>(actionTypes: string | Set<string>) => (
  wrappedReducer: DataReducer<K, V>,
) => {
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
  return (state: ImmutableMap<K, V> = new ImmutableMap(), action: Action) => {
    // Pass the state to the wrapped reducer as the first step.
    const nextState = wrappedReducer(state, action);

    // If the action matches a fetch/success/error type, set the next state again.
    const { type } = action;
    if (fetchTypes.has(type)) return handleFetch<K, V>(nextState, action);
    if (successTypes.has(type)) return handleSuccess<K, V>(nextState, action);
    if (errorTypes.has(type)) return handleError<K, V>(nextState, action);

    return nextState;
  };
};

export default withDataReducer;
