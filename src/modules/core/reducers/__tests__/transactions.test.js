import reducer from '../transactions';

import {
  TRANSACTION_STARTED,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_EVENT_DATA_ERROR,
  TRANSACTION_RECEIPT_ERROR,
  TRANSACTION_SEND_ERROR,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../../actionTypes';

const testActions = (actions, initialState) =>
  actions.reduce((state, [action, assertions]) => {
    const newState = reducer(state, action);
    if (typeof assertions === 'function') assertions(newState);
    return newState;
  }, initialState);

describe(`core: reducers (transactions)`, () => {
  test('Initial state', () => {
    expect(
      reducer(undefined, { type: 'NOT_SUPPORTED_BY_THIS_REDUCER' }),
    ).toEqual({
      pending: {},
      outgoing: {},
    });
  });

  const actionType = 'my action type';
  const eventData = { myEventParam: 123 };
  const hash = 'my transaction hash';
  const options = { gasPrice: 4 };
  const params = { param1: 123 };
  const transactionId = 'my transaction id';

  const initialState = {
    pending: {
      someOtherTxId: {
        actionType: 'some other action type',
      },
    },
    outgoing: {
      someOtherTxHash: {
        actionType: 'different action type',
        receiptReceived: true,
      },
    },
  };

  // Actions
  const startTransaction = {
    type: TRANSACTION_STARTED,
    payload: {
      actionType,
      options,
      params,
      transactionId,
    },
  };
  const sendTransaction = {
    type: TRANSACTION_SENT,
    payload: {
      hash,
      transactionId,
    },
  };
  const receiptReceived = {
    type: TRANSACTION_RECEIPT_RECEIVED,
    payload: {
      hash,
    },
  };
  const eventDataReceived = {
    type: TRANSACTION_EVENT_DATA_RECEIVED,
    payload: {
      eventData,
      hash,
    },
  };
  const sendError = {
    type: TRANSACTION_SEND_ERROR,
    payload: {
      sendError: 'send error',
      transactionId,
    },
  };
  const receiptError = {
    type: TRANSACTION_RECEIPT_ERROR,
    payload: {
      receiptError: 'receipt error',
      hash,
    },
  };
  const eventDataError = {
    type: TRANSACTION_EVENT_DATA_ERROR,
    payload: {
      eventDataError: 'event data error',
      hash,
    },
  };

  test('Sends successfully', () => {
    testActions(
      [
        [
          startTransaction,
          state => {
            expect(state).toEqual({
              pending: {
                [transactionId]: {
                  actionType,
                  options,
                  params,
                },
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                someOtherTxHash: expect.any(Object),
              },
            });
          },
        ],
        [
          sendTransaction,
          state => {
            expect(state).toEqual({
              pending: {
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                [hash]: {
                  actionType,
                  options,
                  params,
                },
                someOtherTxHash: expect.any(Object),
              },
            });
          },
        ],
        [
          receiptReceived,
          state => {
            expect(state).toEqual({
              pending: {
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                [hash]: {
                  actionType,
                  options,
                  params,
                  receiptReceived: true,
                },
                someOtherTxHash: expect.any(Object),
              },
            });
          },
        ],
        [
          eventDataReceived,
          state => {
            expect(state).toEqual({
              pending: {
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                [hash]: {
                  actionType,
                  eventData,
                  options,
                  params,
                  receiptReceived: true,
                },
                someOtherTxHash: expect.any(Object),
              },
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
        [startTransaction],
        [
          sendError,
          state => {
            expect(state).toEqual({
              pending: {
                [transactionId]: {
                  actionType,
                  options,
                  params,
                  sendError: 'send error',
                },
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                someOtherTxHash: expect.any(Object),
              },
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
        [startTransaction],
        [sendTransaction],
        [
          receiptError,
          state => {
            expect(state).toEqual({
              pending: {
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                [hash]: {
                  actionType,
                  options,
                  params,
                  receiptError: 'receipt error',
                },
                someOtherTxHash: expect.any(Object),
              },
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
        [startTransaction],
        [sendTransaction],
        [receiptReceived],
        [
          eventDataError,
          state => {
            expect(state).toEqual({
              pending: {
                someOtherTxId: expect.any(Object),
              },
              outgoing: {
                [hash]: {
                  actionType,
                  options,
                  params,
                  receiptReceived: true,
                  eventDataError: 'event data error',
                },
                someOtherTxHash: expect.any(Object),
              },
            });
          },
        ],
      ],
      initialState,
    );
  });
});
