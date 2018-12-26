/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { Data } from '../../immutable';

import type { DataMap } from '../../immutable';

export type DataAction<K: any> = {
  type: string,
  payload: {
    key: K,
    props: any,
  } & Object,
};

export type DataReducer<K: any, R: *> = (
  state: DataMap<K, R>,
  action: DataAction<K>,
) => DataMap<K, R>;

const handleFetch = (state, action) => {
  const {
    payload: { key },
  } = action;
  const props = { isFetching: true };
  return state.has(key)
    ? state.mergeIn([key], props)
    : state.set(key, Data(props));
};

const handleSuccess = (state, action) => {
  const {
    payload: { key },
  } = action;
  return state
    .setIn([key, 'error'], undefined)
    .setIn([key, 'isFetching'], false);
};

const handleError = (
  state,
  {
    payload: {
      error: { id: error },
      meta: { key },
    },
  },
) => {
  const props = { isFetching: false, error };
  return state.has(key)
    ? state.mergeIn([key], props)
    : state.set(key, Data(props));
};

/*
 * Higher-order reducer to create a map of records with information about
 * the props loading state of each record: whether it is isFetching, any
 * isFetching error, and the props currently loaded.
 *
 * ----------------------------------
 * Parameters (higher order function)
 * ----------------------------------
 * {actionTypes} A single action type (or a `Set` of multiple types) that will
 * be handled as generic fetch action(s). This action type assumes that there
 * will be an error action type with the suffix `_ERROR` and a success action
 * type with the suffix `_SUCCESS` (e.g. `COLONY_FETCH_SUCCESS`).
 *
 * ---------------------------
 * Parameters (inner function)
 * ---------------------------
 * {wrappedReducer} The reducer we are wrapping.
 *
 * --------
 * Generics
 * --------
 * {K} Key of the map, e.g. `ENSName`
 * {R} The record type, e.g. `ColonyRecord`
 */
const withDataReducer = <K: any, R: *>(actionTypes: string | Set<string>) => (
  wrappedReducer: DataReducer<K, R>,
): DataReducer<K, R> => {
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
  return (state = new ImmutableMap(), action) => {
    // Pass the state to the wrapped reducer as the first step.
    const nextState = wrappedReducer(state, action);

    // If the action matches a fetch/success/error type, set the next state again.
    if (fetchTypes.has(action.type)) return handleFetch(nextState, action);
    if (successTypes.has(action.type)) return handleSuccess(nextState, action);
    if (errorTypes.has(action.type)) return handleError(nextState, action);

    return nextState;
  };
};

export default withDataReducer;
