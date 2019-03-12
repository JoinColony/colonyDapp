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
  fetcher: DataFetcher,
  selectArgs: any[],
  fetchArgs: any[],
): {|
  data: ?T,
  isFetching: boolean,
  error: ?string,
  timestamp: number,
|} => {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => fetcher.select(state, ...selectArgs),
    selectArgs,
  );
  const data = useMappedState(mapState);

  useEffect(() => {
    dispatch(fetcher.fetch(...fetchArgs), fetchArgs);
  }, fetchArgs);

  return {
    data: transformFetchedData(data),
    isFetching: isFetchingData(data),
    error: data ? data.error : null,
    timestamp: Date.now(),
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
