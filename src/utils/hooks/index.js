/* @flow */

import type { Action } from '~redux';
import type { RootStateRecord } from '~immutable';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { isFetchingData } from '~immutable/utils';

type DataFetcher = {
  select: (rootState: RootStateRecord, ...selectArgs: any[]) => any,
  fetch: (...fetchArgs: any[]) => Action<*>,
};

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const transformFetchedData = data => {
  if (!data) return null;
  if (data.record && typeof data.record.toJS == 'function') {
    return data.record.toJS();
  }
  return data.record;
};

export const useDataFetcher = (
  fetcher: DataFetcher,
  selectArgs: any[],
  fetchArgs: any[],
) => {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      data: fetcher.select(state, ...selectArgs),
    }),
    selectArgs,
  );
  const { data } = useMappedState(mapState);
  useEffect(() => {
    dispatch(fetcher.fetch(...fetchArgs), fetchArgs);
  }, fetchArgs);
  return {
    data: transformFetchedData(data),
    isFetching: isFetchingData(data),
    error: data ? data.error : null,
  };
};
