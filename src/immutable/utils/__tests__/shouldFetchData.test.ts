/* eslint-env jest */

// eslint-disable-next-line import/no-extraneous-dependencies
import createSandbox from 'jest-sandbox';

import { FetchableData } from '../../FetchableData';
import { Domain } from '../../Domain';

import { shouldFetchData } from '../data';

describe('immutable utils - shouldFetchData', () => {
  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.clear();
  });
  beforeEach(() => {
    sandbox.clear();
  });

  /*
   * Test values
   */
  const record = Domain({
    id: '1',
    name: 'My Domain',
    roles: {},
    parentId: null,
  });
  const error = 'could not load';

  /*
   * Positive cases
   */
  test('it should fetch when data is nully', () => {
    // @ts-ignore
    expect(shouldFetchData()).toBe(true);
    // @ts-ignore
    expect(shouldFetchData(null)).toBe(true);
    // @ts-ignore
    expect(shouldFetchData(undefined)).toBe(true);
  });
  test('it should fetch when a refresh is needed', () => {
    const now = new Date(2018, 0, 1, 12, 30, 0).getTime();
    const lastFetchedAt = new Date(new Date(now).setHours(10)); // 2 hours before 'now'
    const ttl = 1000 * 60 * 60; // one hour

    sandbox.spyOn(global.Date, 'now').mockImplementation(() => now);

    // @ts-ignore
    expect(shouldFetchData(FetchableData({ record, lastFetchedAt }), ttl)).toBe(
      true,
    );
  });
  // eslint-disable-next-line max-len
  test('it should fetch when there is an error and it is the first mount', () => {
    const ttl = 1000 * 60 * 60; // one hour
    // @ts-ignore
    expect(shouldFetchData(FetchableData({ error }), ttl, true)).toBe(true);
  });
  // eslint-disable-next-line max-len
  test('it should fetch when record is undefined and it is the first mount', () => {
    const ttl = 1000 * 60 * 60; // one hour
    // @ts-ignore
    expect(shouldFetchData(FetchableData(), ttl, true)).toBe(true);
  });

  /*
   * Negative cases
   */
  test('it should not fetch when data is fetching', () => {
    // @ts-ignore
    expect(shouldFetchData(FetchableData({ isFetching: true }))).toBe(false);
  });
  test('it should not fetch when data is loaded and no ttl is given', () => {
    // @ts-ignore
    expect(shouldFetchData(FetchableData({ record }))).toBe(false);
  });
  test('it should not fetch when there is an error', () => {
    // @ts-ignore
    expect(shouldFetchData(FetchableData({ error }))).toBe(false);
  });
  test('it should not fetch when a refresh is not needed', () => {
    const now = new Date(2018, 0, 1, 12, 30, 0).getTime();
    const ttl = 1000 * 60 * 60; // one hour
    const lastFetchedAt = new Date(new Date(now).setMinutes(0)); // 30 minutes before 'now'

    sandbox.spyOn(global.Date, 'now').mockImplementation(() => now);

    // @ts-ignore
    expect(shouldFetchData(FetchableData({ record, lastFetchedAt }), ttl)).toBe(
      false,
    );
  });
  test('it should not fetch when record is undefined', () => {
    // @ts-ignore
    expect(shouldFetchData(FetchableData())).toBe(false);
  });
});
