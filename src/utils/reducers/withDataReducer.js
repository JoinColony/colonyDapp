/* @flow */

import type { Map as ImmutableMap } from 'immutable';

export type DataAction<K: any> = {
  type: string,
  payload: {
    key: K,
    props: any,
  } & Object,
};

export type DataRecordMap<K: *, R: *> = ImmutableMap<K, R>;

export type DataReducer<K: any, R: *> = (
  state: DataRecordMap<K, R>,
  action: DataAction<K>,
) => DataRecordMap<K, R>;

const handleFetch = (state, action, record) => {
  const {
    payload: { key },
  } = action;
  return state.update(key, record(), currentRecord =>
    currentRecord.set('isFetching', true),
  );
};

const handleSuccess = (state, action, successReducer) => {
  const {
    payload: { key },
  } = action;
  return successReducer(state, action).mergeIn([key], {
    error: undefined,
    isFetching: false,
  });
};

const handleError = (state, { payload: { key, error } }) =>
  // Ignore the error if the key doesn't exist already
  state.has(key) ? state.mergeIn([key], { error, isFetching: false }) : state;

/*
 * Higher-order reducer to create a map of records with information about
 * the props loading state of each record: whether it is isFetching, any
 * isFetching error, and the props currently loaded.
 *
 * ----------------------------------
 * Parameters (higher order function)
 * ----------------------------------
 * {fetch} A single action type (or a `Set` of multiple types) that will
 * be handled as a generic fetch action.
 *
 * {fetch} A single action type (or a `Set` of multiple types) that will
 * be handled as a generic error action.
 *
 * {success} A map of action types to 'success reducers' (a regular
 * state => action reducer, which is run as the first step when this
 * action is reduced).
 *
 * {record} The record factory function for the state (e.g. `Colony`).
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
const withDataReducer = <K: any, R: *>(
  {
    fetch,
    error,
    success,
  }: {
    fetch: Set<string> | string,
    error: Set<string> | string,
    success: Map<string, ?DataReducer<K, R>>,
  },
  record: any => R,
) => (wrappedReducer: DataReducer<K, R>): DataReducer<K, R> => {
  // Create groups of props actions from the given spec.
  const fetchActions = typeof fetch === 'string' ? new Set([fetch]) : fetch;
  const errorActions = typeof error === 'string' ? new Set([error]) : error;

  // Return a wrapped reducer.
  return (state, action) => {
    let nextState = state;

    // If the action matches a fetch/success/error type, set the next state.
    if (fetchActions.has(action.type)) {
      nextState = handleFetch(state, action, record);
    } else if (success.has(action.type)) {
      const reducer = success.get(action.type);
      // "Should not happen ;)" but here for flow
      if (!reducer) throw new Error(`Reducer not defined for ${action.type}`);

      nextState = handleSuccess(state, action, reducer);
    } else if (errorActions.has(action.type)) {
      nextState = handleError(state, action);
    }

    // Pass the next state to the wrapped reducer.
    return wrappedReducer(nextState, action);
  };
};

export default withDataReducer;
