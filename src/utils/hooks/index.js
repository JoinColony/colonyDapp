/* @flow */

import type { InputSelector } from 'reselect';

import type { Action } from '~redux';
import type { DataRecordType, RootStateRecord } from '~immutable';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { isFetchingData } from '~immutable/utils';

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

/*
 * T: JS type of the fetched and transformed data, e.g. ColonyType
 */
export const useDataFetcher = <T>(
  { fetch, select, ttl = 0 }: DataFetcher,
  selectArgs: any[],
  fetchArgs: any[],
  { ttl: ttlOverride }: DataFetcherOptions,
): {|
  data: ?T,
  isFetching: boolean,
  error: ?string,
|} => {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => select(state, ...selectArgs),
    selectArgs,
  );
  const data = useMappedState(mapState);

  const actualTTL = ttlOverride || ttl;

  const shouldFetch = !data || !!(Date.now() - data.lastFetchedAt > actualTTL);

  useEffect(() => {
    if (shouldFetch) dispatch(fetch(...fetchArgs), fetchArgs);
  }, fetchArgs);

  return {
    data: transformFetchedData(data),
    isFetching: isFetchingData(data),
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
        let potentialSelectorValue = potentialSelector;
        if (potentialSelector && typeof potentialSelector === 'function') {
          potentialSelectorValue = potentialSelector(
            reduxState,
            ...potentialSelectorArgs,
          );
        }
        if (dependantSelector && typeof dependantSelector === 'function') {
          return dependantSelector(
            potentialSelectorValue,
            reduxState,
            ...dependantSelectorArgs,
          );
        }
        return potentialSelectorValue;
      },
    }),
    [...potentialSelectorArgs, ...dependantSelectorArgs],
  );
  return useMappedState(mapState);
};
