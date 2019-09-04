import { Collection, Map as ImmutableMapType } from 'immutable';
import { Selector } from 'reselect';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { Action, AllActions, ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { ActionTransformFnType } from '~utils/actions';
import { DataRecordType, DomainType, RootStateRecord } from '~immutable/index';
import promiseListener, { AsyncFunction } from '~redux/createPromiseListener';
import { isFetchingData, shouldFetchData } from '~immutable/utils';
import { getMainClasses } from '~utils/css';
import { proxyOldRoles, includeParentRoles } from '~utils/data';
import { rolesFetcher, domainsFetcher } from '../../modules/dashboard/fetchers';

interface DataObject<T> {
  data: T | void;
  isFetching: boolean;
  error: string | void;
}

interface KeyedDataObject<T> extends DataObject<T> {
  key: string;
}

type DataFetcher<T> = {
  select: (
    rootState: RootStateRecord,
    ...selectArgs: any[]
  ) => DataRecordType<T> | null;
  fetch: (...fetchArgs: any[]) => Action<any>;
  ttl?: number;
};

type DataSubscriber<T> = {
  select: (
    rootState: RootStateRecord,
    ...selectArgs: any[]
  ) => DataRecordType<T> | null;
  start: (...subArgs: any[]) => Action<any>;
  stop: (...subArgs: any[]) => Action<any>;
};

type DataMapFetcher<T> = {
  select: (
    rootState: RootStateRecord,
    keys: string[],
  ) => ImmutableMapType<string, DataRecordType<T> | null>;
  fetch: (key: any) => Action<any>;
  ttl?: number;
};

type DataTupleFetcher<T> = {
  select: (
    rootState: RootStateRecord,
    args: [any, any][],
  ) => ImmutableMapType<string, DataRecordType<T> | null>;
  fetch: (arg0: [any, any]) => Action<any>;
  ttl?: number;
};

type DataTupleSubscriber<T> = {
  select: (
    rootState: RootStateRecord,
    keys: [any, any][],
  ) => ImmutableMapType<string, DataRecordType<T> | null>;
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

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const transformFetchedData = (data: DataRecordType<any> | null) => {
  if (!data) return null;
  const record =
    typeof data.get === 'function' ? data.get('record') : data.record;
  return record && typeof record.toJS === 'function' ? record.toJS() : record;
};

const defaultTransform = (obj: Collection<any, any>) =>
  obj && typeof obj.toJS === 'function' ? obj.toJS() : obj;

/*
 * Given a redux selector and optional selector arguments, get the
 * (immutable) redux state and return a mutable version of it.
 */
export const useSelector = (
  select: any,
  args: any[] = [],
  transform?: (obj: Collection<any, any>) => any,
) => {
  const mapState = useCallback(state => select(state, ...args), [args, select]);
  // @ts-ignore
  const data = useMappedState(mapState, [mapState]);
  const transformFn =
    typeof transform === 'function'
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

/*
 * T: JS type of the fetched and transformed data, e.g. ColonyType
 */
export const useDataFetcher = <T>(
  { fetch, select, ttl = 0 }: DataFetcher<T>,
  selectArgs: any[],
  fetchArgs: any[],
  { ttl: ttlOverride }: DataFetcherOptions = {},
): DataObject<T> => {
  const dispatch = useDispatch();
  const mapState = useCallback(state => select(state, ...selectArgs), [
    select,
    selectArgs,
  ]);
  const data = useMappedState(mapState);

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
      // @ts-ignore
      dispatch(fetch(...fetchArgs), fetchArgs);
    }
  }, [dispatch, fetch, fetchArgs, shouldFetch]);

  return {
    data: transformFetchedData(data),
    isFetching: shouldFetch && isFetchingData(data),
    error: data && data.error ? data.error : null,
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
  const allData: ImmutableMapType<string, DataRecordType<any>> = useMappedState(
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
          data: transformFetchedData(data),
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
export const useDataSubscriber = <T>(
  { start, stop, select }: DataSubscriber<T>,
  selectArgs: any[],
  subArgs: any[],
): DataObject<T> => {
  const dispatch = useDispatch();
  const mapState = useCallback(state => select(state, ...selectArgs), [
    select,
    selectArgs,
  ]);
  const data = useMappedState(mapState);

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
      // @ts-ignore
      dispatch(start(...subArgs), subArgs);
    }
    isFirstMount.current = false;
  }, [dispatch, shouldSubscribe, start, stop, subArgs]);

  useEffect(
    () => () => {
      // @ts-ignore
      dispatch(stop(...subArgs), subArgs);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    data: transformFetchedData(data),
    isFetching: shouldSubscribe && isFetchingData(data),
    error: data && data.error ? data.error : null,
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
  const allData: ImmutableMapType<string, DataRecordType<any>> = useMappedState(
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
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
  const allData: ImmutableMapType<string, DataRecordType<any>> = useMappedState(
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
          data: transformFetchedData(data),
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

/*
 * Proxy the new redux state of roles to the old structure of founder and
 * admins.
 */
export const useOldRoles = (colonyAddress: Address) => {
  const { data: newRoles, isFetching, error } = useDataFetcher<any>(
    rolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const roles = useMemo(() => proxyOldRoles(newRoles), [newRoles]);
  return { data: roles, isFetching, error };
};

/*
 * Fetch an object of all domains with users who have roles in them. If
 * includeParents is true, it also includes effective roles that users have in
 * those domains as a result of parent domain roles. Note that this will not
 * include child domains where the user has no roles - in such cases where data
 * is needed for a specific domain and user, the useUserDomainRoles hook should
 * be used.
 *
 * Returns in the format { [domainId]: { [userAddress]: { [role]: boolean } } }
 */
export const useRoles = (
  colonyAddress: Address,
  includeParents = false, // This should not change
) => {
  const {
    data: rolesFromState,
    isFetching: isFetchingRoles,
    error,
  } = useDataFetcher<any>(rolesFetcher, [colonyAddress], [colonyAddress]);

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[]
  >(
    domainsFetcher,
    // Setting these to undefined will prevent fetching when we don't want it
    [includeParents ? colonyAddress : undefined],
    [includeParents ? colonyAddress : undefined],
  );

  // Include root domains (not in redux state)
  const domainsWithRoot = Array.isArray(domains)
    ? [{ id: 1, name: 'root' }, ...domains]
    : domains;

  const permissions =
    includeParents && rolesFromState && domainsWithRoot
      ? includeParentRoles(rolesFromState, domainsWithRoot)
      : rolesFromState;
  return {
    data: permissions,
    isFetching: isFetchingRoles || (isFetchingDomains && includeParents),
    error,
  };
};

/*
 * Fetch the roles which a single user has in a specific domain. If
 * includeParents is true, it will also check for any roles that the user has
 * in this domain by effect of them being set in parent domains.
 *
 * Returns in the format { [role]: boolean }
 */
export const useUserDomainRoles = (
  colonyAddress: Address,
  domainId: number,
  userAddress: Address,
  includeParents = false, // This should not change
) => {
  const dispatch = useDispatch();
  const { data: roles, isFetching, error } = useRoles(
    colonyAddress,
    includeParents,
  );
  useEffect(() => {
    if (colonyAddress && domainId && userAddress) {
      dispatch<AllActions>({
        type: ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH,
        meta: { key: colonyAddress },
        payload: { colonyAddress, domainId, userAddress },
      });
    }
  }, [colonyAddress, dispatch, domainId, userAddress]);
  const userDomainRoles = roles
    ? (roles[domainId] || {})[userAddress] || {}
    : {};
  return { data: userDomainRoles, isFetching, error };
};
