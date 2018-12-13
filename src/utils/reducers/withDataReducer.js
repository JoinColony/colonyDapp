/* @flow */

import type { Map as ImmutableMap, RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { Action } from '~types';

// TODO improve type specificity
export type DataProps<D: *> = {
  fetching: number,
  data: D,
  error: string, // TBD how useful this is
};

export type DataAction<K: any, D: Object> = {
  type: string,
  payload: {
    key: K,
    data: $Shape<D>,
  } & Object,
};

export type DataRecord<D: *> = RecordOf<DataProps<D>>;

export type DataRecordMap<K: *, D: *> = ImmutableMap<K, DataRecord<D>>;

export type DataReducer<K: any, D: *> = (
  state: DataRecordMap<K, D>,
  action: Action | DataAction<K, D>,
) => DataRecordMap<K, D>;

export type RecordReducer<K: any, D: *> = (
  state: DataRecordMap<K, D>,
  action: DataAction<K, D>,
) => D;

const defaultValues = {
  data: undefined,
  fetching: 0,
  error: undefined,
};

/*
 * The `Data` record is designed to be used in `withDataReducer`-wrapped
 * reducers as the value of the Map.
 *
 * The `data` property of the `Data` record will contain a record of
 * the given `record` argument (i.e. the actual data we care about),
 * and the other properties indicate the fetching state.
 */
export const Data: RecordFactory<DataProps<*>> = Record(defaultValues);

/*
 * Higher-order reducer to create a map of records with information about
 * the data loading state of each record: whether it is fetching, any
 * fetching error, and the data currently loaded.
 *
 * ----------------------------------
 * Parameters (higher order function)
 * ----------------------------------
 * {dataActionMap} FIXME update this
 * {record} A record factory function used for the `data` property,
 * i.e. the actual data we are storing with this reducer.
 *
 * ---------------------------
 * Parameters (inner function)
 * ---------------------------
 * {reducer} The reducer we are applying the data actions to.
 * @NOTE: FIXME update this. The DataActions will _not_ be handled by this reducer,
 * but any other actions will.
 *
 * --------
 * Generics
 * --------
 * {K} Key of the map, e.g. `string` for IDs
 * {D} The data record type, e.g. `RecordOf<Props>`
 */
const withDataReducer = <K: any, D: *>(
  {
    fetch,
    error,
    success,
  }: {
    fetch: Set<string> | string,
    error: Set<string> | string,
    success: Map<string, ?RecordReducer<K, D>> | string,
  },
  record: RecordFactory<*>,
) => (wrappedReducer: DataReducer<K, D>): DataReducer<K, D> => {
  // Create groups of data actions from the given spec
  const fetchActions = typeof fetch === 'string' ? new Set([fetch]) : fetch;
  const errorActions = typeof error === 'string' ? new Set([error]) : error;
  const successActions =
    typeof success === 'string' ? new Map([[success, undefined]]) : success;

  // Return a wrapped reducer
  return (state, action) => {
    const { type, payload } = action;
    let newState = state;

    if (fetchActions.has(type)) {
      const { key } = payload;
      newState = state.has(key)
        ? state.updateIn([key, 'fetching'], 0, fetching => fetching + 1)
        : state.set(key, Data({ fetching: 1, data: record() }));
    } else if (successActions.has(type)) {
      const recordReducer = successActions.get(type);
      const { key, data } = payload;

      newState = state.update(
        key,
        Data({ data: record(data) }),
        ({ fetching, data: currentData }) =>
          Data({
            error: undefined,
            fetching: fetching > 0 ? fetching - 1 : fetching,
            data:
              typeof recordReducer === 'function'
                ? recordReducer(state, action)
                : currentData.mergeDeep(data),
          }),
      );
    } else if (errorActions.has(type)) {
      const { key, error: errorMessage } = action.payload;
      newState = state.has(key)
        ? state
            .setIn([key, 'error'], errorMessage)
            .updateIn([key, 'fetching'], fetching =>
              fetching > 0 ? fetching - 1 : fetching,
            )
        : state; // Ignore error if the key doesn't exist already
    }

    return wrappedReducer(newState, action);
  };
};

export default withDataReducer;
