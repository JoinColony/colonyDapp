/* @flow */

import type { Collection } from 'immutable';
import type { InputSelector } from 'reselect';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import type { Action } from '~redux';
import type { DataRecordType, RootStateRecord } from '~immutable';
import type { AsyncFunction } from '../../createPromiseListener';

import { isFetchingData, shouldFetchData } from '~immutable/utils';

import promiseListener from '../../createPromiseListener';

type DataFetcher = {|
  select: (
    rootState: RootStateRecord,
    ...selectArgs: any[]
  ) => ?DataRecordType<*>,
  fetch: (...fetchArgs: any[]) => Action<*>,
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

const transformFetchedData = (data: DataRecordType<*>) => {
  if (!data) return null;
  return data.record && typeof data.record.toJS == 'function'
    ? data.record.toJS()
    : data.record;
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
 * T: JS type of the fetched and transformed data, e.g. ColonyType
 */
export const useDataFetcher = <T>(
  { fetch, select, ttl = 0 }: DataFetcher,
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
}: {|
  submit: string,
  success: string,
  error: string,
|}): { current: AsyncFunction<P, R> } => {
  const ref = useRef();
  useEffect(
    () => {
      ref.current = promiseListener.createAsyncFunction<P, R>({
        start: submit,
        resolve: success,
        reject: error,
      });
      return () => {
        ref.current.unsubscribe();
      };
    },
    [submit, success, error],
  );
  // TODO can a React genius find out why we don't get the same
  // behaviour when returning ref.current?
  return ref;
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
  // TODO can a React genius find out why we don't get the same
  // behaviour when returning ref.current?
  return ref;
};
