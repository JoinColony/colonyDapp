/* @flow */

import type { Collection, Map as ImmutableMapType } from 'immutable';
import type { InputSelector } from 'reselect';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import type { Action } from '~redux';
import type { ActionTransformFnType } from '~utils/actions';
import type { DataRecordType, RootStateRecord } from '~immutable';
import type { AsyncFunction } from '../../createPromiseListener';

import { isFetchingData, shouldFetchData } from '~immutable/utils';

import promiseListener from '../../createPromiseListener';

type DataFetcher<T> = {|
  select: (
    rootState: RootStateRecord,
    ...selectArgs: any[]
  ) => ?DataRecordType<T>,
  fetch: (...fetchArgs: any[]) => Action<*>,
  ttl?: number,
|};

type DataMapFetcher<T> = {|
  select: (
    rootState: RootStateRecord,
    keys: string[],
  ) => ImmutableMapType<string, ?DataRecordType<T>>,
  fetch: (key: string) => Action<*>,
  ttl?: number,
|};

type DataTupleFetcher<T> = {|
  select: (
    rootState: RootStateRecord,
    args: [string, string][],
  ) => ImmutableMapType<string, ?DataRecordType<T>>,
  fetch: ([string, string]) => Action<*>,
  ttl?: number,
|};

type DependantSelector = (
  selector: InputSelector<RootStateRecord, *, *>,
  reduxState: RootStateRecord,
  extraArgs?: any[],
) => boolean;

export type Given = (
  potentialSelector: InputSelector<RootStateRecord, *, *>,
  dependantSelector?: DependantSelector,
) => any | boolean;

type DataFetcherOptions = {
  ttl?: number,
};

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const transformFetchedData = (data: ?DataRecordType<*>) => {
  if (!data) return null;
  const record =
    typeof data.get == 'function' ? data.get('record') : data.record;
  return record && typeof record.toJS == 'function' ? record.toJS() : record;
};

const defaultTransform = (obj: Collection<*, *>) =>
  obj && typeof obj.toJS == 'function' ? obj.toJS() : obj;
/*
 * Given a redux selector and optional selector arguments, get the
 * (immutable) redux state and return a mutable version of it.
 */
export const useSelector = (
  select: InputSelector<*, *, *>,
  args: *[] = [],
  transform?: (obj: Collection<*, *>) => any,
) => {
  const mapState = useCallback(state => select(state, ...args), [args, select]);
  const data = useMappedState(mapState, [mapState]);
  const transformFn =
    typeof transform == 'function'
      ? transform
      : select.transform || defaultTransform;

  return useMemo(() => transformFn(data), [data, transformFn]);
};

/*
 * Esteemed React developer!
 *
 * Are *you* tired of giving `useMemo` some dependencies, only to find
 * recomputations with the same data (e.g. arrays)?
 *
 * Better make a memo to self: simply use `createCustomMemo`™!
 *
 * It's only the memoization function designed *by* a developer, *for* that
 * very same developer. Upgrade today!
 */
export const createCustomMemo = (comparator: (...any) => boolean) => (
  fn: Function,
  deps: any[],
) => {
  const lastDeps = useRef(deps);
  const lastResult = useRef(fn());
  if (comparator(lastDeps, deps)) {
    return lastResult.current;
  }
  lastResult.current = fn();
  lastDeps.current = deps;
  return lastResult.current;
};

const areFlatArraysEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = arr1.length - 1; i >= 0; i -= 1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

// Only supporting a 2-length tuple for now
const areTupleArraysEqual = (arr1: [any, any][], arr2: [any, any][]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = arr1.length - 1; i >= 0; i -= 1) {
    if (arr1[i][0] !== arr2[i][0] || arr1[i][1] !== arr2[i][1]) {
      return false;
    }
  }
  return true;
};

export const useMemoWithFlatArray = createCustomMemo(areFlatArraysEqual);
export const useMemoWithTupleArray = createCustomMemo(areTupleArraysEqual);

/*
 * T: JS type of the fetched and transformed data, e.g. ColonyType
 */
export const useDataFetcher = <T>(
  { fetch, select, ttl = 0 }: DataFetcher<T>,
  selectArgs: any[],
  fetchArgs: any[],
  { ttl: ttlOverride }: DataFetcherOptions = {},
): {|
  data: ?T,
  isFetching: boolean,
  error: ?string,
|} => {
  const dispatch = useDispatch();
  const mapState = useCallback(state => select(state, ...selectArgs), [
    select,
    selectArgs,
  ]);
  const data = useMappedState(mapState);

  const isFirstMount = useRef(true);

  const shouldFetch = shouldFetchData(
    data,
    ttlOverride || ttl,
    isFirstMount.current,
    fetchArgs,
  );

  useEffect(
    () => {
      isFirstMount.current = false;
      if (shouldFetch) dispatch(fetch(...fetchArgs), fetchArgs);
    },
    [dispatch, fetch, fetchArgs, shouldFetch],
  );

  return {
    data: transformFetchedData(data),
    isFetching: shouldFetch && isFetchingData(data),
    error: data ? data.error : null,
  };
};

/*
 * Given a `DataMapFetcher` object and an array of keys (the items
 * to fetch data for), select the data and fetch the parts that need
 * to be (re-)fetched.
 */
export const useDataMapFetcher = <T>(
  { fetch, select, ttl: ttlDefault = 0 }: DataMapFetcher<T>,
  keys: string[],
  { ttl: ttlOverride }: DataFetcherOptions = {},
): {|
  data: ?T,
  key: string,
  isFetching: boolean,
  error: ?string,
|}[] => {
  /*
   * Created memoized keys to guard the rest of the function against
   * unnecessary updates.
   */
  const memoizedKeys = useMemoWithFlatArray(() => keys, [keys]);

  const dispatch = useDispatch();
  const allData: ImmutableMapType<string, DataRecordType<*>> = useMappedState(
    useCallback(state => select(state, memoizedKeys), [select, memoizedKeys]),
  );

  const isFirstMount = useRef(true);
  const ttl = ttlOverride || ttlDefault;

  /*
   * Use with the array of keys we want data for, get the data from `allData`
   * and use `shouldFetchData` to obtain an array of keys we should
   * dispatch fetch actions for.
   */
  const keysToFetchFor = useMemo(
    () =>
      memoizedKeys.filter(key =>
        shouldFetchData(allData.get(key), ttl, isFirstMount.current, [key]),
      ),
    [allData, memoizedKeys, ttl],
  );

  /*
   * Set the `isFirstMount` ref and dispatch any needed fetch actions.
   */
  useEffect(
    () => {
      isFirstMount.current = false;
      keysToFetchFor.map(key => dispatch(fetch(key)));
    },
    [keysToFetchFor, dispatch, fetch, memoizedKeys],
  );

  /*
   * Return an array of data objects with keys by mapping over the keys
   * and getting the data from `allData`.
   */
  return useMemo(
    () =>
      memoizedKeys.map(key => {
        const data = allData.get(key);
        return {
          key,
          data: transformFetchedData(data),
          isFetching: keysToFetchFor.includes(key) && isFetchingData(data),
          error: data ? data.error : null,
        };
      }),
    [allData, memoizedKeys, keysToFetchFor],
  );
};

/*
 * Given a `DataTupleFetcher` object and a tuple with the items
 * to fetch data for, select the data and fetch the parts that need
 * to be (re-)fetched.
 */
export const useDataTupleFetcher = <T>(
  { fetch, select, ttl: ttlDefault = 0 }: DataTupleFetcher<T>,
  keys: Array<*>,
  { ttl: ttlOverride }: DataFetcherOptions = {},
): {|
  data: ?T,
  key: string,
  isFetching: boolean,
  error: ?string,
|}[] => {
  /*
   * Created memoized keys to guard the rest of the function against
   * unnecessary updates.
   */
  const memoizedKeys = useMemoWithTupleArray(() => keys, [keys]);
  const dispatch = useDispatch();
  const allData: ImmutableMapType<string, DataRecordType<*>> = useMappedState(
    useCallback(state => select(state, memoizedKeys), [select, memoizedKeys]),
  );

  const isFirstMount = useRef(true);
  const ttl = ttlOverride || ttlDefault;

  /*
   * Use with the array of keys we want data for, get the data from `allData`
   * and use `shouldFetchData` to obtain an array of keys we should
   * dispatch fetch actions for.
   */
  const keysToFetchFor = useMemo(
    () =>
      memoizedKeys.filter(entry =>
        shouldFetchData(allData.get(entry[1]), ttl, isFirstMount.current, [
          entry,
        ]),
      ),
    [allData, memoizedKeys, ttl],
  );

  /*
   * Set the `isFirstMount` ref and dispatch any needed fetch actions.
   */
  useEffect(
    () => {
      isFirstMount.current = false;
      keysToFetchFor.map(key => dispatch(fetch(key)));
    },
    [keysToFetchFor, dispatch, fetch, memoizedKeys],
  );

  /*
   * Return an array of data objects with keys by mapping over the keys
   * and getting the data from `allData`.
   */
  return useMemo(
    () =>
      memoizedKeys.map(entry => {
        const data = allData.get(entry[1]);
        return {
          key: entry[1],
          entry,
          data: transformFetchedData(data),
          isFetching: keysToFetchFor.includes(entry[1]) && isFetchingData(data),
          error: data ? data.error : null,
        };
      }),
    [allData, memoizedKeys, keysToFetchFor],
  );
};

export const useFeatureFlags = (
  potentialSelectorArgs?: any[] = [],
  dependantSelectorArgs?: any[] = [],
) => {
  const mapState = useCallback(
    reduxState => ({
      given: (
        potentialSelector: any,
        dependantSelector?: DependantSelector,
      ) => {
        const potentialSelectorValue =
          typeof potentialSelector == 'function'
            ? potentialSelector(reduxState, ...potentialSelectorArgs)
            : potentialSelector;

        return typeof dependantSelector == 'function'
          ? dependantSelector(
              potentialSelectorValue,
              reduxState,
              ...dependantSelectorArgs,
            )
          : potentialSelectorValue;
      },
    }),
    [dependantSelectorArgs, potentialSelectorArgs],
  );
  return useMappedState(mapState);
};

export const useAsyncFunction = <P, R>({
  submit,
  success,
  error,
  transform,
}: {|
  submit: string,
  success: string,
  error: string,
  transform?: ActionTransformFnType,
|}): $PropertyType<AsyncFunction<P, R>, 'asyncFunction'> => {
  const asyncFunc = useMemo(
    () => {
      let setPayload;
      if (transform) {
        setPayload = (action, payload) => {
          const newAction = transform({ ...action, payload });
          return { ...newAction, meta: { ...action.meta, ...newAction.meta } };
        };
      }
      return promiseListener.createAsyncFunction<P, R>({
        start: submit,
        resolve: success,
        reject: error,
        setPayload,
      });
    },
    [submit, success, error, transform],
  );
  // Unsubscribe from the previous async function when it changes
  const prevAsyncFunc = usePrevious(asyncFunc);
  if (prevAsyncFunc && prevAsyncFunc !== asyncFunc) {
    prevAsyncFunc.unsubscribe();
  }
  // Automatically unsubscribe on unmount
  useEffect(() => () => asyncFunc.unsubscribe(), [asyncFunc]);
  return asyncFunc.asyncFunction;
};

/*
 * To avoid state updates when this component is unmounted, use a ref
 * that is set to false when cleaning up.
 */
export const useMounted = () => {
  const ref = useRef(true);
  useEffect(
    () => () => {
      ref.current = false;
    },
    [],
  );
  return ref;
};
