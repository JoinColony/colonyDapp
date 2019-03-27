import createSandbox from 'jest-sandbox';

import DataRecord from '../../Data';
import DomainRecord from '../../Domain';

import { shouldFetchData } from '../../index';

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
  const record = DomainRecord({ id: 1, name: 'My Domain' });
  const error = 'could not load';

  /*
   * Positive cases
   */
  test('it should fetch when data is nully', () => {
    expect(shouldFetchData()).toBe(true);
    expect(shouldFetchData(null)).toBe(true);
    expect(shouldFetchData(undefined)).toBe(true);
  });
  test('it should fetch when a refresh is needed', () => {
    const now = new Date(2018, 0, 1, 12, 30, 0).getTime();
    const lastFetchedAt = new Date(now).setHours(10); // 2 hours before 'now'
    const ttl = 1000 * 60 * 60; // one hour

    sandbox.spyOn(global.Date, 'now').mockImplementation(() => now);

    expect(shouldFetchData(DataRecord({ record, lastFetchedAt }), ttl)).toBe(
      true,
    );
  });
  test('it should fetch when there is an error and it is the first mount', () => {
    const ttl = 1000 * 60 * 60; // one hour
    expect(shouldFetchData(DataRecord({ error }), ttl, true)).toBe(true);
  });
  test('it should fetch when record is undefined and it is the first mount', () => {
    const ttl = 1000 * 60 * 60; // one hour
    expect(shouldFetchData(DataRecord(), ttl, true)).toBe(true);
  });

  /*
   * Negative cases
   */
  test('it should not fetch when data is fetching', () => {
    expect(shouldFetchData(DataRecord({ isFetching: true }))).toBe(false);
  });
  test('it should not fetch when data is loaded and no ttl is given', () => {
    expect(shouldFetchData(DataRecord({ record }))).toBe(false);
  });
  test('it should not fetch when there is an error', () => {
    expect(shouldFetchData(DataRecord({ error }))).toBe(false);
  });
  test('it should not fetch when a refresh is not needed', () => {
    const now = new Date(2018, 0, 1, 12, 30, 0).getTime();
    const ttl = 1000 * 60 * 60; // one hour
    const lastFetchedAt = new Date(now).setMinutes(0); // 30 minutes before 'now'

    sandbox.spyOn(global.Date, 'now').mockImplementation(() => now);

    expect(shouldFetchData(DataRecord({ record, lastFetchedAt }), ttl)).toBe(
      false,
    );
  });
  test('it should not fetch when record is undefined', () => {
    expect(shouldFetchData(DataRecord())).toBe(false);
  });
});
