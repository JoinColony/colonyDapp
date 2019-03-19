/* @flow */

// $FlowFixMe
import { useEffect, useRef } from 'react';
import { useDispatch } from 'redux-react-hook';

import { colonyDomainsSelector, singleColonySelector } from './selectors';
import { fetchColony, fetchColonyDomains } from './actionCreators';
import { useReduxState } from '~utils/hooks';

// eslint-disable-next-line import/prefer-default-export
export const colonyFetcher = {
  select: singleColonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
};

// TODO find a generalised solution for fetching a list of data records.
export const useDomainsFetcher = (ensName: string) => {
  const dispatch = useDispatch();
  const domains = useReduxState(colonyDomainsSelector, [ensName]);

  const isFirstMount = useRef(true);

  const shouldFetch =
    domains == null || (isFirstMount.current && domains.size === 0);

  useEffect(
    () => {
      isFirstMount.current = false;
      if (shouldFetch) dispatch(fetchColonyDomains(ensName), [ensName]);
    },
    [shouldFetch, ensName],
  );

  return domains && typeof domains.toJS == 'function'
    ? domains.toJS()
    : domains;
};
