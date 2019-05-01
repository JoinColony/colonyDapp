/* @flow */

import type { DataRecordType } from '../Data';

/*
 * Given a data record and an optional TTL value, determine whether
 * the data should be fetched.
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
  if (data.get('isFetching')) return false;

  // If there was an error earlier but we have a freshly mounted component, try again to fetch
  if (data.get('error') && isFirstMount) return true;

  // If there's no record (and it's not fetching) and it's the first mount, fetch
  if (typeof data.get('record') == 'undefined' && isFirstMount) return true;

  // Check if the TTL is passed, if so, fetch again
  return !!(
    ttl &&
    data.get('lastFetchedAt') > 0 &&
    Date.now() - data.get('lastFetchedAt') > ttl
  );
};

export const isFetchingData = (data: ?DataRecordType<*>) =>
  !data || data.isFetching;
