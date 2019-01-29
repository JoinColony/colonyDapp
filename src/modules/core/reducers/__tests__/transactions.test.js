import { Map as ImmutableMap, Record } from 'immutable';

import { CoreTransactions, Transaction } from '~immutable';

import reducer from '../transactions';

import {
  transactionSent,
  createTxActionCreator,
  transactionEventDataError,
  transactionEventDataReceived,
  transactionReceiptError,
  transactionReceiptReceived,
  transactionSendError,
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
  const hash = 'my transaction hash';
  const options = { gasPrice: 4 };
  const params = { param1: 123 };
  const id = 'my transaction id';
  const existingTxId = 'my existing tx id';
  const lifecycle = { created: 'lifecycle action type for created' };
  const context = 'network';
  const methodName = 'createColony';

  const initialState = CoreTransactions({
    list: ImmutableMap({
      [existingTxId]: Transaction({
        createdAt: new Date(2018, 0, 1),
      }),
    }),
    gasPrices: {},
  });

  // Actions

  const createdTx = createTxActionCreator({
    context,
    lifecycle,
    methodName,
  })({
    meta: { id },
    options,
    params,
    // TODO: this won't be necessary anymore soon as we will always supply an external id
    id, // This is custom to the tests (overwrites the generated id)
  });

  const sentTx = transactionSent(id, { hash });
  const receiptReceived = transactionReceiptReceived(id, { receipt: { hash } });
  const eventDataReceived = transactionEventDataReceived(id, { eventData });
  const sendError = transactionSendError(id, { message: 'send error' });
  const receiptError = transactionReceiptError(id, {
    message: 'receipt error',
  });
  const eventDataError = transactionEventDataError(id, {
    message: 'event data error',
  });

  test('Sends successfully', () => {
    testActions(
      [
        [
          createdTx,
          state => {
            // TODO ideally we should evaluate the state based on the whole
            // map, but jest has some unexpected results when using `toEqual`
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
              errors: [],
              eventData: undefined,
              hash: undefined,
              id,
              lifecycle,
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
              errors: [],
              eventData: undefined,
              hash, // hash should have been set
              id,
              lifecycle,
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
              errors: [],
              eventData: undefined,
              hash,
              id,
              lifecycle,
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
              errors: [],
              eventData, // should have been set
              hash,
              id,
              lifecycle,
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
              errors: [{ type: 'send', message: 'send error' }],
              eventData: undefined,
              hash: undefined,
              id,
              lifecycle,
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
              errors: [{ type: 'receipt', message: 'receipt error' }],
              eventData: undefined,
              hash,
              id,
              lifecycle,
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
              errors: [{ type: 'eventData', message: 'event data error' }],
              eventData: undefined,
              hash,
              id,
              lifecycle,
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
