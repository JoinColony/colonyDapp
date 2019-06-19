import { BehaviorSubject } from 'rxjs';

import createSandbox from 'jest-sandbox';
import ColonyData from '../ColonyData';

describe('ColonyData', () => {
  const sandbox = createSandbox();
  afterEach(() => sandbox.clear());
  beforeEach(() => sandbox.clear());

  const events1 = [1, 2, 3];
  const events2 = [7, 8, 9];

  const dep = {};

  const makeQueryAndSubject = () => {
    const subject = new BehaviorSubject(events1);
    const query = Object.freeze({
      name: 'query',
      context: ['foo'],
      prepare: sandbox.fn(async () => ({})),
      executeAsync: sandbox.fn(async () => events1),
      executeObservable: sandbox.fn(() => subject),
      reducer: sandbox.fn((acc, value) => value),
      seed: [],
    });
    return [query, subject];
  };

  test('Executing a query (async)', async () => {
    const context = { foo: 'bar' };
    const metadata = { bar: 'baz' };
    const args = { quux: 'zap' };

    const data = new ColonyData(context);
    sandbox.spyOn(data, 'validateContext');

    const [query] = makeQueryAndSubject();

    const queryExecution = data.executeQuery(query, { metadata, args });

    const result = await queryExecution;

    expect(data.validateContext).toHaveBeenCalledWith(query);

    expect(result).toEqual(3); // we're just passing through the value
  });

  test('Executing a query (subscription)', async () => {
    const context = { foo: 'bar' };
    const metadata = { bar: 'baz' };
    const args = { quux: 'zap' };

    const data = new ColonyData(context);
    sandbox.spyOn(data, 'validateContext');

    const listener = sandbox.fn();

    const [query, subject] = makeQueryAndSubject();

    const execution = data.executeQuery(query, { metadata, args });

    await new Promise((resolve, reject) => {
      execution.subscribe({
        complete: resolve,
        error: reject,
        next: listener,
      });
      setTimeout(() => {
        subject.next(events2);
        subject.complete();
      }, 1000);
    });

    expect(data.validateContext).toHaveBeenCalledWith(query);

    expect(listener).toHaveBeenCalledWith(3);
    expect(listener).toHaveBeenCalledWith(9);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('Executing a query (tap events)', async () => {
    const context = { foo: 'bar' };
    const metadata = { bar: 'baz' };
    const args = { quux: 'zap' };

    const data = new ColonyData(context);
    sandbox.spyOn(data, 'validateContext');

    const listener = sandbox.fn();

    const [query, subject] = makeQueryAndSubject();

    await new Promise((resolve, reject) => {
      data.executeQuery(query, { metadata, args }).tap({
        complete: resolve,
        error: reject,
        next: listener,
      });
      setTimeout(() => {
        subject.next(events2);
        subject.complete();
      }, 1000);
    });

    expect(data.validateContext).toHaveBeenCalledWith(query);
    expect(query.prepare).toHaveBeenCalledWith(context, metadata, args);
    expect(query.executeObservable).toHaveBeenCalledWith(dep, args);
    expect(query.reducer).not.toHaveBeenCalled();

    expect(listener).toHaveBeenCalledWith(events1);
    expect(listener).toHaveBeenCalledWith(events2);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('Running predefined queries', async () => {
    const context = { foo: 'bar' };

    const options = { args: { baz: 'qux' }, metadata: { quux: 'quuz' } };

    const data = new ColonyData(context);
    sandbox.spyOn(data, 'executeQuery');

    expect(data).toHaveProperty('queries');
    expect(data.queries).toHaveProperty('getTask', expect.any(Function));

    expect(data.executeQuery).not.toHaveBeenCalled();

    try {
      await data.queries.getTask(options);
    } catch (caughtError) {
      // ignore, we're just concerned with how it's called
    }

    expect(data.executeQuery).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'getTask' }),
      options,
    );
  });
});
