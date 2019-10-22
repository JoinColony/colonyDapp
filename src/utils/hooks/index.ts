import { Collection, Map as ImmutableMap } from 'immutable';
import { Selector } from 'reselect';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { Action } from '~redux/index';
import { RemoveFirstFromTuple } from '~types/index';
import { ActionTransformFnType } from '~utils/actions';
import { FetchableDataRecord } from '~immutable/index';
import promiseListener, { AsyncFunction } from '~redux/createPromiseListener';
import { isFetchingData, shouldFetchData } from '~immutable/utils';
import { getMainClasses } from '~utils/css';

import { RootStateRecord } from '../../modules/state';

interface DataObject<T> {
  data?: T;
  isFetching: boolean;
  error?: string;
}

interface KeyedDataObject<T> extends DataObject<T> {
  key: string;
}

interface DataFetcher<S> {
  select: S;
  fetch: (...fetchArgs: any[]) => Action<any>;
  ttl?: number;
}

interface DataSubscriber<S> {
  select: S;
  start: (...subArgs: any[]) => Action<any>;
  stop: (...subArgs: any[]) => Action<any>;
}

type DataMapFetcher<T> = {
  select: (
    rootState: RootStateRecord,
    keys: string[],
  ) => ImmutableMap<string, FetchableDataRecord<T>>;
  fetch: (key: any) => Action<any>;
  ttl?: number;
};

type DataTupleFetcher<T> = {
  select: (
    rootState: RootStateRecord,
    args: [any, any][],
  ) => ImmutableMap<string, FetchableDataRecord<T>>;
  fetch: (arg0: [any, any]) => Action<any>;
  ttl?: number;
};

type DataTupleSubscriber<T> = {
  select: (
    rootState: RootStateRecord,
    keys: [any, any][],
  ) => ImmutableMap<string, FetchableDataRecord<T>>;
  start: (...subArgs: any[]) => Action<any>;
  stop: (...subArgs: any[]) => Action<any>;
};

type DependantSelector = (
  selector: Selector<RootStateRecord, any>,
  reduxState: RootStateRecord,
  extraArgs?: any[],
) => boolean;

export type Given = (
  potentialSelector: Selector<RootStateRecord, any>,
  dependantSelector?: DependantSelector,
) => any | boolean;

type DataFetcherOptions = {
  ttl?: number;
};

// This conditional type allows data to be undefined/null, but uses
// further conditional types in order to get the possibly-toJS'ed type
// of the record property.
type MaybeFetchedData<T extends undefined | null | { record: any }> = T extends
  | undefined
  | null
  ? T
  : (T extends { record: any }
      ? (T extends { record: { toJS: Function } }
          ? ReturnType<T['record']['toJS']>
          : T['record'])
      : T);

// This conditional type allows data to be undefined/null, but uses a
// further conditional type in order to get the possibly-toJS'ed type.
type MaybeSelected<
  T extends undefined | null | { toJS: (...args: any[]) => any }
> = T extends undefined | null
  ? T
  : (T extends { toJS: Function } ? ReturnType<T['toJS']> : T);

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const transformSelectedData = (data?: any) => {
  if (!data) return undefined;
  const record =
    typeof data.get === 'function' ? data.get('record') : data.record;
  return record && typeof record.toJS === 'function' ? record.toJS() : record;
};

const defaultTransform = <T extends { toJS(): any }>(
  obj: T,
  // The return type of this could be improved if there was a way
  // to map from immutable to non-immutable types
) => (obj && typeof obj.toJS === 'function' ? obj.toJS() : obj);

/*
 * Given a redux selector and optional selector arguments, get the
 * (immutable) redux state and return a mutable version of it.
 */
export const useSelector = <
  S extends (...args: any) => any & { transform?: <T>(obj: T) => any },
  A extends RemoveFirstFromTuple<Parameters<S>> // Omit the first arg (state)
>(
  select: S,
  args: A = ([] as unknown) as A,
  transform?: (obj: Collection<any, any>) => any,
) => {
  const mapState = useCallback(state => select(state, ...args), [args, select]);

  const data: ReturnType<typeof select> = useMappedState(mapState);

  const transformFn =
    typeof transform === 'function'
      ? transform
      : (select as { transform?: <T>(obj: T) => any }).transform ||
        defaultTransform;

  return useMemo<MaybeSelected<typeof data>>(() => transformFn(data), [
    data,
    transformFn,
  ]);
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
export const createCustomMemo = (
  comparator: (...compArgs: any[]) => boolean,
) => (fn: Function, deps: any[]) => {
  const lastDeps = useRef(deps);
  const lastResult = useRef(fn());
  if (comparator(lastDeps.current, deps)) {
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

export const useDataFetcher = <
  S extends (...args: any[]) => any,
  A extends RemoveFirstFromTuple<Parameters<S>>
>(
  { fetch, select, ttl = 0 }: DataFetcher<S>,
  selectArgs: A,
  fetchArgs: any[],
  { ttl: ttlOverride }: DataFetcherOptions = {},
) => {
  const dispatch = useDispatch();
  const mapState = useCallback(state => select(state, ...selectArgs), [
    select,
    selectArgs,
  ]);
  const data: ReturnType<typeof select> = useMappedState(mapState);

  const isFirstMount = useRef(true);

  /*
   * @todo Fetches are not guarded properly for the same item when called together
   */
  const shouldFetch = shouldFetchData(
    data, // I don't know whether there's a nicer way to do this and make flow happy at the same time
    ttlOverride === 0 ? 0 : ttlOverride || ttl,
    isFirstMount.current,
    fetchArgs,
  );

  useEffect(() => {
    isFirstMount.current = false;
    if (shouldFetch) {
      dispatch(fetch(...fetchArgs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetch, shouldFetch, ...fetchArgs]);

  return {
    data: transformSelectedData(data) as MaybeFetchedData<typeof data>,
    isFetching: !!(shouldFetch && isFetchingData(data)),
    error: data && data.error ? data.error : undefined,
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
): KeyedDataObject<T>[] => {
  /*
   * Created memoized keys to guard the rest of the function against
   * unnecessary updates.
   */
  const memoizedKeys = useMemoWithFlatArray(() => keys, keys);

  const dispatch = useDispatch();
  const allData: ImmutableMap<
    string,
    FetchableDataRecord<any>
  > = useMappedState(
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
  useEffect(() => {
    isFirstMount.current = false;
    keysToFetchFor.map(key => dispatch(fetch(key)));
  }, [keysToFetchFor, dispatch, fetch, memoizedKeys]);

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
          data: transformSelectedData(data),
          isFetching: keysToFetchFor.includes(key) && isFetchingData(data),
          error: data && data.error ? data.error : null,
        };
      }),
    [memoizedKeys, allData, keysToFetchFor],
  );
};

/*
 * T: JS type of the fetched and transformed data, e.g. ColonyType
 */
export const useDataSubscriber = <
  S extends (...args: any[]) => any,
  A extends RemoveFirstFromTuple<Parameters<S>>
>(
  { start, stop, select }: DataSubscriber<S>,
  selectArgs: A,
  subArgs: any[],
) => {
  const dispatch = useDispatch();
  const mapState = useCallback(state => select(state, ...selectArgs), [
    select,
    selectArgs,
  ]);
  const data: ReturnType<typeof select> = useMappedState(mapState);

  const isFirstMount = useRef(true);

  const shouldSubscribe = shouldFetchData(
    data,
    Infinity,
    isFirstMount.current,
    subArgs,
    true,
  );

  useEffect(() => {
    if (shouldSubscribe) {
      dispatch(start(...subArgs));
    }
    isFirstMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, shouldSubscribe, start, stop, ...subArgs]);

  useEffect(
    () => () => {
      dispatch(stop(...subArgs));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, stop, ...subArgs],
  );

  return {
    data: transformSelectedData(data) as MaybeFetchedData<typeof data>,
    isFetching: !!(shouldSubscribe && isFetchingData(data)),
    error: data && data.error ? data.error : undefined,
  };
};

/*
 * Given a `DataTupleSubscriber` object and a tuple with the items
 * to fetch data for, select the data and subscribe to any future data.
 */
export const useDataTupleSubscriber = <T>(
  { start, stop, select }: DataTupleSubscriber<T>,
  keys: any[],
): DataObject<T>[] => {
  const memoizedKeys = useMemoWithTupleArray(() => keys, keys);
  const dispatch = useDispatch();
  const allData: ImmutableMap<
    string,
    FetchableDataRecord<any>
  > = useMappedState(
    useCallback(state => select(state, memoizedKeys), [select, memoizedKeys]),
  );

  const isFirstMount = useRef(true);

  const keysToFetchFor = useMemo(
    () =>
      memoizedKeys.filter(entry =>
        shouldFetchData(
          allData.get(entry[1]),
          Infinity,
          isFirstMount.current,
          [entry],
          true,
        ),
      ),
    [allData, memoizedKeys],
  );

  useEffect(() => {
    isFirstMount.current = false;
    keysToFetchFor.map(key => dispatch(start(...key)));
  }, [keysToFetchFor, dispatch, memoizedKeys, start]);

  useEffect(
    () => () => {
      keysToFetchFor.map(key => dispatch(stop(...key)));
    },
    [dispatch, keysToFetchFor, stop],
  );

  return useMemo(
    () =>
      memoizedKeys.map(entry => {
        const data = allData.get(entry[1]);
        return {
          key: entry[1],
          entry,
          data: transformSelectedData(data) as MaybeFetchedData<typeof data>,
          isFetching: keysToFetchFor.includes(entry[1]) && isFetchingData(data),
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
  keys: any[],
  { ttl: ttlOverride }: DataFetcherOptions = {},
): KeyedDataObject<T>[] => {
  /*
   * Created memoized keys to guard the rest of the function against
   * unnecessary updates.
   */
  const memoizedKeys = useMemoWithTupleArray(() => keys, keys);
  const dispatch = useDispatch();
  const allData: ImmutableMap<
    string,
    FetchableDataRecord<any>
  > = useMappedState(
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
  useEffect(() => {
    isFirstMount.current = false;
    keysToFetchFor.map(key => dispatch(fetch(key)));
  }, [keysToFetchFor, dispatch, fetch, memoizedKeys]);

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
          data: transformSelectedData(data) as MaybeFetchedData<typeof data>,
          isFetching: keysToFetchFor.includes(entry[1]) && isFetchingData(data),
          error: data ? data.error : null,
        };
      }),
    [memoizedKeys, allData, keysToFetchFor],
  );
};

export const useAsyncFunction = <P, R>({
  submit,
  success,
  error,
  transform,
}: {
  submit: string;
  success: string;
  error: string;
  transform?: ActionTransformFnType;
}): AsyncFunction<P, R>['asyncFunction'] => {
  const asyncFunc = useMemo(() => {
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
  }, [submit, success, error, transform]);
  // Unsubscribe from the previous async function when it changes
  const prevAsyncFunc = usePrevious(asyncFunc);
  if (prevAsyncFunc && prevAsyncFunc !== asyncFunc) {
    // @ts-ignore
    prevAsyncFunc.unsubscribe();
  }
  // Automatically unsubscribe on unmount
  useEffect(() => () => asyncFunc.unsubscribe(), [asyncFunc]);
  return asyncFunc.asyncFunction as any;
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

export const useMainClasses = (
  appearance: any,
  styles: any,
  className?: string,
) =>
  useMemo(() => className || getMainClasses(appearance, styles), [
    appearance,
    className,
    styles,
  ]);
