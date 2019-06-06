import { of } from 'rxjs';

import createSandbox from 'jest-sandbox';
import ColonyData from '../ColonyData';

describe('ColonyData', () => {
  const sandbox = createSandbox();
  afterEach(() => sandbox.clear());
  beforeEach(() => sandbox.clear());

  const addOne = sandbox.fn(n => n + 1);

  const simpleQuery = Object.freeze({
    name: 'simpleQuery',
    context: [],
    async prepare() {
      await new Promise(resolve => setTimeout(resolve, 100));
      return { addOne };
    },
    execute(deps) {
      return of(deps.addOne(1));
    },
  });

  test('Executing a query (async)', async () => {
    const data = new ColonyData({});

    const metadata = { colonyAddress: 'foo', draftId: 'bar' };
    const args = { comments: false };

    const result = await data.executeQuery(simpleQuery, metadata, args);
    expect(result).toBe(2);
  });

  test('Executing a query (subscription)', async () => {
    const data = new ColonyData({});

    const metadata = { colonyAddress: 'foo', draftId: 'bar' };
    const args = { comments: false };

    const listener = sandbox.fn();

    await new Promise((resolve, reject) => {
      data.executeQuery(simpleQuery, metadata, args).subscribe({
        complete: resolve,
        error: reject,
        next: listener,
      });
    });

    expect(listener).toHaveBeenCalledWith(2);
    expect(listener).toHaveBeenCalledTimes(1);
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
      // ignore
    }

    expect(data.executeQuery).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'getTask' }),
      options,
    );
  });
});
