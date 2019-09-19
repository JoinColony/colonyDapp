import { Map as ImmutableMap, fromJS } from 'immutable';

import { ActionTypeString, AllActions } from '~redux/types/actions';
import { FetchableData, FetchableDataType } from '../../immutable';
import { getActionTypes } from './utils';

export type DataReducer<S extends ImmutableMap<any, any>> = (
  state: S,
  action: any,
) => S;

const getNextState = <S extends ImmutableMap<any, any>, V extends any>(
  state: S,
  key: any,
  payload: Partial<FetchableDataType<V>>,
) => {
  const immutablePayload = fromJS(payload);
  const data = FetchableData<V>(immutablePayload);

  return state.has(key)
    ? state.mergeDeepIn([key], immutablePayload)
    : state.set(key, data);
};

const handleFetch = <S extends ImmutableMap<any, any>, V extends any>(
  state: S,
  action: any,
) => {
  const {
    meta: { key },
  } = action;
  return getNextState<S, V>(state, key, { isFetching: true });
};

const handleSuccess = <S extends ImmutableMap<any, any>, V extends any>(
  state: S,
  action: any,
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

const handleError = <S extends ImmutableMap<any, any>, V extends any>(
  state: S,
  { meta: { key }, payload: error }: any,
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
 * {S} The state this reducer handles, e.g. `ImmutableMap<ENSName, FetchableData<ColonyRecord>>`
 *
 * {V} The value wrapped in the data record, e.g. `ColonyRecord` or `ListType<TransationRecord>`
 */
const withFetchableDataMap = <S extends ImmutableMap<any, any>, V extends any>(
  actionTypes: ActionTypeString | Set<ActionTypeString>,
  initialState: S,
) =>
  /*
   * @todo Remove initialState arg for `withFetchableDataMap.
   */
  (wrappedReducer: DataReducer<S>) => {
    const { fetchTypes, successTypes, errorTypes } = getActionTypes(
      actionTypes,
    );

    // Return a wrapped reducer.
    return (state: S = initialState, action: AllActions) => {
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

export default withFetchableDataMap;
