import { of, Observable } from 'rxjs';
import createSandbox from 'jest-sandbox';

import QueryExecution from '../QueryExecution';

describe('QueryExecution', () => {
  const sandbox = createSandbox();
  afterEach(() => sandbox.clear());
  beforeEach(() => sandbox.clear());

  test('constructor', () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };
    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(),
      execute: sandbox.fn(),
    });

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

    const dep = sandbox.fn();

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => of(1, 2, 3)),
      reducer: sandbox.fn(() => 1337),
      seed: 0,
    });

    const execution = new QueryExecution(query, context, options);

    sandbox.spyOn(execution, '_executePromise');
    sandbox.spyOn(execution, '_createRawObservable');

    const result = await execution;

    expect(result).toBe(1337);

    expect(execution).toHaveProperty('promise', expect.any(Promise));
    expect(execution._executePromise).toHaveBeenCalledTimes(1);
  });

  test('as a promise with an error', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const dep = sandbox.fn();

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => {
        throw new Error('Boo!');
      }),
    });

    const execution = new QueryExecution(query, context, options);

    expect(execution).rejects.toMatch('Boo!');
  });

  test('as a subscription of changes', async () => {
    const events = [
      { type: 'NUMBER', payload: 420 },
      { type: 'NUMBER', payload: 69 },
    ];

    const context = { foo: 'bar' };
    const dep = sandbox.fn();
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => of(...events)),
      reducer: sandbox.fn((acc, { payload }) => payload + acc),
      seed: 0,
    });

    const execution = new QueryExecution(query, context, options);

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      execution.subscribe({
        complete: resolve,
        error: reject,
        next: listener,
      });
    });

    expect(query.reducer).toHaveBeenCalledWith(0, events[0], 0);
    expect(query.reducer).toHaveBeenCalledWith(420, events[1], 1);
    expect(query.reducer).toHaveBeenCalledTimes(2);

    expect(listener).toHaveBeenCalledWith(420);
    expect(listener).toHaveBeenCalledWith(489);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('as a subscription of events', async () => {
    const events = [
      { type: 'NUMBER', payload: 420 },
      { type: 'NUMBER', payload: 69 },
    ];
    const context = { foo: 'bar' };
    const dep = sandbox.fn();
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => of(...events)),
      reducer: sandbox.fn(),
      seed: 0,
    });

    const execution = new QueryExecution(query, context, options);

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      execution.tap({
        complete: resolve,
        error: reject,
        next: listener,
      });
    });

    expect(query.reducer).not.toHaveBeenCalled();

    expect(listener).toHaveBeenCalledWith(events[0]);
    expect(listener).toHaveBeenCalledWith(events[1]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('observables are created correctly (as a promise)', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const dep = sandbox.fn();

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => of(1, 2, 3)),
    });

    const execution = new QueryExecution(query, context, options);
    sandbox.spyOn(execution, '_createObservable');

    expect(execution).toHaveProperty('_observable', undefined);

    await execution;

    expect(execution).toHaveProperty('_observable', expect.any(Observable));

    expect(query.prepare).toHaveBeenCalledWith(
      context,
      options.metadata,
      expect.objectContaining({ ...options.args, continuous: false }),
    );
    expect(query.prepare).toHaveBeenCalledTimes(1);

    expect(query.execute).toHaveBeenCalledWith(
      dep,
      expect.objectContaining({ ...options.args, continuous: false }),
    );
    expect(query.execute).toHaveBeenCalledTimes(1);

    expect(execution._createObservable).toHaveBeenCalledWith({
      continuous: false,
    });
    expect(execution._createObservable).toHaveBeenCalledTimes(1);
  });

  test('observables are created correctly (as a subscription)', async () => {
    const context = { foo: 'bar' };
    const options = { args: { bar: 'baz' }, metadata: { qux: 'zap' } };

    const dep = sandbox.fn();

    const query = Object.freeze({
      name: 'query',
      context,
      prepare: sandbox.fn(async () => dep),
      execute: sandbox.fn(() => of(1, 2, 3)),
    });

    const execution = new QueryExecution(query, context, options);
    sandbox.spyOn(execution, '_createObservable');

    expect(execution).toHaveProperty('_observable', undefined);

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      execution.subscribe({
        complete: resolve,
        error: reject,
        next: listener,
      });
    });

    expect(execution).toHaveProperty('_observable', expect.any(Observable));

    expect(query.prepare).toHaveBeenCalledWith(
      context,
      options.metadata,
      expect.objectContaining({ ...options.args, continuous: true }),
    );
    expect(query.prepare).toHaveBeenCalledTimes(1);

    expect(query.execute).toHaveBeenCalledWith(
      dep,
      expect.objectContaining({ ...options.args, continuous: true }),
    );
    expect(query.execute).toHaveBeenCalledTimes(1);

    expect(execution._createObservable).toHaveBeenCalledWith({
      continuous: true,
    });
    expect(execution._createObservable).toHaveBeenCalledTimes(1);
  });
});
