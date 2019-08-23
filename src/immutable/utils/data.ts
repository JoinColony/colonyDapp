import { DataRecordType } from '../Data';

/*
 * Given a data record and an optional TTL value, determine whether
 * the data should be fetched.
 */
export const shouldFetchData = (
  data: DataRecordType<any> | null,
  ttl: number,
  isFirstMount: boolean,
  fetchArgs: any[] = [],
  alwaysFetch?: boolean,
): boolean => {
  // If there are arguments in the fetch args that are still undefined, don't fetch yet
  // Useful when using multiple fetchers consecutively (with depedencies on each other)
  if (fetchArgs.some(arg => typeof arg === 'undefined')) return false;

  // If we don't have any data yet, definitely fetch
  if (data == null) return true;

  // If we're already fetching data, don't fetch
  if (data.get('isFetching')) return false;

  // If there was an error earlier but we have a freshly mounted component, try again to fetch
  if (data.get('error') && isFirstMount) return true;

  // If there's no record (and it's not fetching) and it's the first mount, fetch
  if (
    (typeof data.get('record') === 'undefined' || alwaysFetch) &&
    isFirstMount
  )
    return true;

  // Check if the TTL is passed, if so, fetch again
  return !!(
    data.get('lastFetchedAt') &&
    (data.get('lastFetchedAt').getTime() > 0 &&
      Date.now() - data.get('lastFetchedAt').getTime() > ttl)
  );
};

export const isFetchingData = (data: DataRecordType<any> | null) =>
  !data || data.isFetching;
