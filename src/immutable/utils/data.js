/* @flow */

import type { DataRecordType } from '../Data';

/*
 * Given a data record and an optional TTL value, determine whether
 * the data should be fetched.
 *
 * The data should be fetched if:
 * 1. It is falsy
 * 2. It is not fetching or loaded
 * 3. There was an error but it is the component's first mount
 * 4. Record is undefined and it is the component's first mount
 * 5. Its `lastFetchedAt` property indicates it should be refreshed
 */
export const shouldFetchData = (
  data: ?DataRecordType<*>,
  ttl: number,
  isFirstMount: boolean,
  fetchArgs: any[] = [],
): boolean => {
  // If there are arguments in the fetch args that are still undefined, don't fetch yet
  // Useful when using multiple fetchers consecutively (with depedencies on each other)
  if (fetchArgs.some(arg => typeof arg == 'undefined')) return false;
  // If we don't have any data yet, definitely fetch
  if (data == null) return true;
  // If we're already fetching data, don't fetch
  if (data.isFetching) return false;
  // If there was an error earlier but we have a freshly mounted component, try again to fetch
  if (data.error && isFirstMount) return true;
  if (typeof data.record === 'undefined' && isFirstMount) return true;

  // Check if the TTL is passed, if so, fetch again
  return !!(
    ttl &&
    data.lastFetchedAt > 0 &&
    Date.now() - data.lastFetchedAt > ttl
  );
};

export const isFetchingData = (data: ?DataRecordType<*>) =>
  !data || data.isFetching;
