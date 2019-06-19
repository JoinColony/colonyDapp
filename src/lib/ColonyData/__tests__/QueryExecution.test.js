import { BehaviorSubject } from 'rxjs';
import createSandbox from 'jest-sandbox';

import QueryExecution from '../QueryExecution';

describe('QueryExecution', () => {
  const sandbox = createSandbox();
  afterEach(() => sandbox.clear());
  beforeEach(() => sandbox.clear());

  const dep = {};

  const makeQueryAndSubject = () => {
    const subject = new BehaviorSubject([0, 0, 0]);
    const query = Object.freeze({
      name: 'query',
      context: ['foo'],
      prepare: sandbox.fn(async () => ({})),
      executeAsync: sandbox.fn(async () => [0, 0, 0]),
      executeObservable: sandbox.fn(() => subject),
      reducer: sandbox.fn((acc, value) => value),
      seed: [],
    });
    return [query, subject];
  };

  test('constructor', () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const [query] = makeQueryAndSubject();

    const execution = new QueryExecution(query, context, options);

    expect(execution).toHaveProperty('args', options.args);
    expect(execution).toHaveProperty('context', context);
    expect(execution).toHaveProperty('metadata', options.metadata);
    expect(execution).toHaveProperty('query', query);

    expect(execution).toHaveProperty('_promise', undefined);
    expect(execution).toHaveProperty('_observable', undefined);
  });

  test('as a promise that resolves successfully', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const [query] = makeQueryAndSubject();

    const execution = new QueryExecution(query, context, options);
    sandbox.spyOn(execution, 'reduce');
    const promiseSpy = sandbox.spyOn(execution, 'promise', 'get');

    const result = await execution;

    expect(result).toBe(0);

    expect(query.prepare).toHaveBeenCalledWith(
      context,
      options.metadata,
      options.args,
    );
    expect(query.executeAsync).toHaveBeenCalledWith(dep, options.args);

    expect(execution.reduce).toHaveBeenCalledWith([0, 0, 0]);
    expect(execution.reduce).toHaveBeenCalledTimes(1);

    expect(execution).toHaveProperty('_promise', expect.any(Promise));
    expect(promiseSpy).toHaveBeenCalledTimes(1);
  });

  test('as a promise with an error', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const [query] = makeQueryAndSubject();

    query.executeAsync.mockImplementationOnce(() => {
      throw new Error('Boo!');
    });

    const execution = new QueryExecution(query, context, options);

    expect(execution).rejects.toEqual(new Error('Boo!'));
  });

  test('as a subscription of reduced events', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const [query, subject] = makeQueryAndSubject();

    const execution = new QueryExecution(query, context, options);
    sandbox.spyOn(execution, 'reduce');
    const obsGetter = sandbox.spyOn(execution, 'observable', 'get');

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      execution.subscribe({
        complete: resolve,
        error: reject,
        next: listener,
      });
      setTimeout(() => {
        subject.next([1, 2, 3]);
        subject.next([7, 8, 9]);
        subject.complete();
      });
    });

    expect(obsGetter).toHaveBeenCalled();

    expect(execution.reduce).toHaveBeenCalledWith([0, 0, 0]);
    expect(execution.reduce).toHaveBeenCalledWith([1, 2, 3]);
    expect(execution.reduce).toHaveBeenCalledWith([7, 8, 9]);
    expect(execution.reduce).toHaveBeenCalledTimes(3);

    expect(listener).toHaveBeenCalledWith(0);
    expect(listener).toHaveBeenCalledWith(3);
    expect(listener).toHaveBeenCalledWith(9);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  test('as a subscription of tapped events', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const [query, subject] = makeQueryAndSubject();

    const execution = new QueryExecution(query, context, options);

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      execution.tap({
        complete: resolve,
        error: reject,
        next: listener,
      });
      setTimeout(() => {
        subject.next([1, 2, 3]);
        subject.next([7, 8, 9]);
        subject.complete();
      });
    });

    expect(query.reducer).not.toHaveBeenCalled();

    expect(listener).toHaveBeenCalledWith([0, 0, 0]);
    expect(listener).toHaveBeenCalledWith([1, 2, 3]);
    expect(listener).toHaveBeenCalledWith([7, 8, 9]);
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
