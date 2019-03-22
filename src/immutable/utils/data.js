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
): boolean => {
  // This could be simpler, but for the sake of readability let's spell it out.
  if (data == null) return true;
  if (data.isFetching) return false;
  if (data.error && isFirstMount) return true;
  if (typeof data.record === 'undefined' && isFirstMount) return true;

  return !!(
    ttl &&
    data.lastFetchedAt > 0 &&
    Date.now() - data.lastFetchedAt > ttl
  );
};

export const isFetchingData = (data: ?DataRecordType<*>) =>
  !data || data.isFetching;
