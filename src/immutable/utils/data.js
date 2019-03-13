/* @flow */

import type { DataRecordType } from '../Data';

/*
 * Given a data record and an optional TTL value, determine whether
 * the data should be fetched.
 *
 * The data should be fetched if:
 * 1. it is falsy
 * 2. it is not fetching or loaded
 * 3. its `lastFetchedAt` property indicates it should be refreshed
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

  return !!(
    ttl &&
    data.lastFetchedAt > 0 &&
    Date.now() - data.lastFetchedAt > ttl
  );
};

export const isFetchingData = (data: ?DataRecordType<*>) =>
  !data || data.isFetching;
