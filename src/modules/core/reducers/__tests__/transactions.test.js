import { Map as ImmutableMap, Record } from 'immutable';

import { CoreTransactions, TransactionRecord } from '~immutable';

import reducer from '../transactions';

import {
  createTxAction,
  transactionSent,
  transactionError,
  transactionSucceeded,
  transactionReceiptReceived,
} from '../../actionCreators';

const testActions = (actions, initialState) =>
  actions.reduce((state, [action, assertions]) => {
    const newState = reducer(state, action);
    if (typeof assertions === 'function') assertions(newState);
    return newState;
  }, initialState);

describe(`core: reducers (transactions)`, () => {
  test('Initial state', () => {
    const newState = reducer(undefined, {
      type: 'NOT_SUPPORTED_BY_THIS_REDUCER',
    });
    expect(newState.list).toEqual(ImmutableMap());
  });

  const eventData = { myEventParam: 123 };
  const from = 'my wallet address';
  const hash = 'my transaction hash';
  const options = { gasPrice: 4 };
  const params = { param1: 123 };
  const id = 'my transaction id';
  const existingTxId = 'my existing tx id';
  const context = 'network';
  const methodName = 'createColony';

  const initialState = CoreTransactions({
    list: ImmutableMap({
      [existingTxId]: TransactionRecord({
        createdAt: new Date(2018, 0, 1),
      }),
    }),
    gasPrices: {},
  });

  // Actions

  const createdTx = createTxAction(id, from, {
    context,
    methodName,
    options,
    params,
  });

  const sentTx = transactionSent(id, { hash });
  const receiptReceived = transactionReceiptReceived(id, { receipt: { hash } });
  const eventDataReceived = transactionSucceeded(id, { eventData });

  const sendError = transactionError(id, {
    type: 'send',
    message: 'oh no, send error',
  });
  const receiptError = transactionError(id, {
    type: 'receipt',
    message: 'oh no, receipt error',
  });
  const eventDataError = transactionError(id, {
    type: 'eventData',
    message: 'oh no, event data error',
  });

  test('Sends successfully', () => {
    testActions(
      [
        [
          createdTx,
          state => {
            // Ideally we should evaluate the state based on the whole map,
            // but jest has some unexpected results when using `toEqual`
            // with immutable maps.
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: undefined,
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash: undefined,
              id,
              methodName,
              options,
              params,
              receipt: undefined,
              /*
               * Initial status is set to `ready`
               */
              status: 'ready',
            });
          },
        ],
        [
          sentTx,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: undefined,
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash, // hash should have been set
              id,
              methodName,
              options,
              params,
              receipt: undefined,
              /*
               * During sending the transaction is set to 'pending'
               */
              status: 'pending',
            });
          },
        ],
        [
          receiptReceived,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: undefined,
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash,
              id,
              methodName,
              options,
              params,
              receipt: expect.any(Object), // should have been set
              /*
               * If it went through successfully, it's set to `succeeded`
               */
              status: 'pending',
            });
          },
        ],
        [
          eventDataReceived,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: undefined,
              eventData, // should have been set
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash,
              id,
              methodName,
              options,
              params,
              receipt: expect.any(Object),
              /*
               * If it went through successfully, it's set to `succeeded`
               */
              status: 'succeeded',
            });
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles send error', () => {
    testActions(
      [
        [createdTx],
        [
          sendError,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: {
                type: 'send',
                message: 'oh no, send error',
              },
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash: undefined,
              id,
              methodName,
              options,
              params,
              receipt: undefined,
              /*
               * If it failed, it's set to `failed`... obviously
               */
              status: 'failed',
            });
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles receipt error', () => {
    testActions(
      [
        [createdTx],
        [sentTx],
        [
          receiptError,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: {
                type: 'receipt',
                message: 'oh no, receipt error',
              },
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash,
              id,
              methodName,
              options,
              params,
              receipt: undefined,
              /*
               * If it failed, it's set to `failed`... obviously
               */
              status: 'failed',
            });
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles event data error', () => {
    testActions(
      [
        [createdTx],
        [sentTx],
        [receiptReceived],
        [
          eventDataError,
          state => {
            expect(state.list.size).toBe(2);

            const existingTx = state.list.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.list.get(existingTxId).toJS(),
            );

            const tx = state.list.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual({
              context,
              createdAt: expect.any(Date),
              error: {
                type: 'eventData',
                message: 'oh no, event data error',
              },
              eventData: undefined,
              from,
              gasLimit: undefined,
              gasPrice: undefined,
              group: undefined,
              hash,
              id,
              methodName,
              options,
              params,
              receipt: expect.any(Object),
              /*
               * If it failed, it's set to `failed`... obviously
               */
              status: 'failed',
            });
          },
        ],
      ],
      initialState,
    );
  });
});
