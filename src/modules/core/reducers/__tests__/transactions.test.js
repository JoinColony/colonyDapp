import { Map as ImmutableMap, Record } from 'immutable';

import reducer from '../transactions';

import { Transaction } from '../../records';

import {
  transactionSent,
  transactionStarted,
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
    expect(newState).toEqual(new ImmutableMap());
  });

  const actionType = 'my action type';
  const eventData = { myEventParam: 123 };
  const hash = 'my transaction hash';
  const options = { gasPrice: 4 };
  const params = { param1: 123 };
  const id = 'my transaction id';
  const existingTxId = 'my existing tx id';

  const initialState = new ImmutableMap({
    [existingTxId]: Transaction({
      actionType: 'some other action type',
      createdAt: new Date(2018, 0, 1),
    }),
  });

  // Actions
  const startedTx = transactionStarted(id, actionType, params, null, options);
  const sentTx = transactionSent(id, { hash });
  const receiptReceived = transactionReceiptReceived(id, { hash });
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
          startedTx,
          state => {
            // TODO ideally we should evaluate the state based on the whole
            // map, but jest has some unexpected results when using `toEqual`
            // with immutable maps.
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [],
                id,
                options,
                params,
              }),
            );
          },
        ],
        [
          sentTx,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [],
                id,
                hash, // hash should have been set
                options,
                params,
              }),
            );
          },
        ],
        [
          receiptReceived,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [],
                hash,
                id,
                options,
                params,
                receiptReceived: true, // should have been set
              }),
            );
          },
        ],
        [
          eventDataReceived,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [],
                eventData, // should have been set
                hash,
                id,
                options,
                params,
                receiptReceived: true,
              }),
            );
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles send error', () => {
    testActions(
      [
        [startedTx],
        [
          sendError,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [{ type: 'send', message: 'send error' }],
                id,
                options,
                params,
              }),
            );
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles receipt error', () => {
    testActions(
      [
        [startedTx],
        [sentTx],
        [
          receiptError,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [{ type: 'receipt', message: 'receipt error' }],
                id,
                options,
                params,
              }),
            );
          },
        ],
      ],
      initialState,
    );
  });

  test('Handles event data error', () => {
    testActions(
      [
        [startedTx],
        [sentTx],
        [receiptReceived],
        [
          eventDataError,
          state => {
            expect(state.size).toBe(2);

            const existingTx = state.get(existingTxId);
            expect(Record.isRecord(existingTx)).toBe(true);
            expect(existingTx.toJS()).toEqual(
              initialState.get(existingTxId).toJS(),
            );

            const tx = state.get(id);
            expect(Record.isRecord(tx)).toBe(true);
            expect(tx.toJS()).toEqual(
              expect.objectContaining({
                actionType,
                createdAt: expect.any(Date),
                errors: [{ type: 'eventData', message: 'event data error' }],
                id,
                options,
                params,
              }),
            );
          },
        ],
      ],
      initialState,
    );
  });
});
