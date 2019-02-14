import { END } from 'redux-saga';

import transactionChannel from '../transactionChannel';

import { ACTIONS } from '../../..';

/*
 * Dummy values
 */
const hash = 'hash';
const transaction = {
  hash,
};
const receipt = {
  hash,
  status: 1,
};
const eventData = {
  colonyId: 2,
};
const id = 'the tx id';
const params = { test: 123 };
const tx = { id, params };

/*
 * Note that these tests run the transactionChannel outside of any redux-saga/
 * store context.
 */
describe('core: sagas (transactionChannel)', () => {
  const takePromise = channel => new Promise(resolve => channel.take(resolve));

  const chainPromisesAsArray = promises =>
    promises.reduce(
      (chainedPromise, promise) =>
        chainedPromise.then(values =>
          promise.then(value => values.concat(value)),
        ),
      Promise.resolve([]),
    );

  const takeAllFromChannel = async channel => {
    // Create promises to take actions from the channel (more than will be emitted)
    const actions = await chainPromisesAsArray([
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
      takePromise(channel),
    ]);
    // Remove the repeating END action (indicating that the channel is closed)
    return actions.filter(
      (action, index) => action !== END || actions[index - 1] !== END,
    );
  };

  test('It captures events of a successful tx correctly', async () => {
    const receiptPromise = new Promise(resolve => resolve(receipt));
    const eventDataPromise = new Promise(resolve => resolve(eventData));
    const txPromise = new Promise(resolve =>
      resolve({
        eventDataPromise,
        meta: {
          receiptPromise,
          transaction,
        },
      }),
    );
    const channel = transactionChannel(txPromise, tx);

    const actions = await takeAllFromChannel(channel);
    // The events should be in this order
    const [
      sentAction,
      receiptReceivedAction,
      eventDataReceivedAction,
      channelEnd,
    ] = actions;
    expect(actions.length).toBe(4);

    expect(sentAction).toHaveProperty('type', ACTIONS.TRANSACTION_SENT);
    expect(sentAction).toHaveProperty('payload', {
      hash,
      params,
    });
    expect(sentAction).toHaveProperty('meta', { id });

    expect(receiptReceivedAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    );
    expect(receiptReceivedAction).toHaveProperty('payload', {
      params,
      receipt,
    });
    expect(receiptReceivedAction).toHaveProperty('meta', { id });

    expect(eventDataReceivedAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_EVENT_DATA_RECEIVED,
    );
    expect(eventDataReceivedAction).toHaveProperty('payload', {
      eventData,
      params,
    });
    expect(eventDataReceivedAction).toHaveProperty('meta', { id });

    expect(channelEnd).toBe(END);
  });

  test('It captures events of a tx that did not send correctly', async () => {
    const txPromise = new Promise((resolve, reject) =>
      reject(new Error('could not send')),
    );
    const channel = transactionChannel(txPromise, tx);

    const actions = await takeAllFromChannel(channel);
    // The events should be in this order
    const [errorAction, channelEnd] = actions;
    expect(actions.length).toBe(2);

    expect(errorAction).toHaveProperty('type', ACTIONS.TRANSACTION_ERROR);
    expect(errorAction).toHaveProperty('payload', {
      error: {
        message: 'could not send',
        params,
        type: 'send',
      },
    });
    expect(errorAction).toHaveProperty('meta', { id });

    expect(channelEnd).toBe(END);
  });

  test('It captures events of a failed (but sent) tx correctly', async () => {
    const failedReceipt = {
      status: 0,
      hash,
    };
    const receiptPromise = new Promise(resolve => resolve(failedReceipt));
    const eventDataPromise = new Promise(resolve => resolve(eventData));
    const txPromise = new Promise(resolve =>
      resolve({
        eventDataPromise,
        meta: {
          receiptPromise,
          transaction,
        },
      }),
    );
    const channel = transactionChannel(txPromise, tx);

    const actions = await takeAllFromChannel(channel);
    // The events should be in this order
    const [
      sentAction,
      receiptReceivedAction,
      errorAction,
      channelEnd,
    ] = actions;
    expect(actions.length).toBe(4);

    expect(sentAction).toHaveProperty('type', ACTIONS.TRANSACTION_SENT);
    expect(sentAction).toHaveProperty('payload', {
      hash,
      params,
    });
    expect(sentAction).toHaveProperty('meta', { id });

    expect(receiptReceivedAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    );
    expect(receiptReceivedAction).toHaveProperty('payload', {
      params,
      receipt: failedReceipt,
    });
    expect(receiptReceivedAction).toHaveProperty('meta', { id });

    expect(errorAction).toHaveProperty('type', ACTIONS.TRANSACTION_ERROR);
    expect(errorAction).toHaveProperty('payload', {
      error: {
        message: 'The transaction was unsuccessful',
        params,
        type: 'unsuccessful',
      },
    });
    expect(errorAction).toHaveProperty('meta', { id });

    expect(channelEnd).toBe(END);
  });

  test('It captures events of a tx with receipt errors correctly', async () => {
    const receiptPromise = new Promise((resolve, reject) =>
      reject(new Error('could not get receipt')),
    );
    const eventDataPromise = new Promise(resolve => resolve(eventData));
    const txPromise = new Promise(resolve =>
      resolve({
        eventDataPromise,
        meta: {
          receiptPromise,
          transaction,
        },
      }),
    );
    const channel = transactionChannel(txPromise, tx);

    const actions = await takeAllFromChannel(channel);
    // The events should be in this order
    const [sentAction, receiptErrorAction, channelEnd] = actions;
    expect(actions.length).toBe(3);

    expect(sentAction).toHaveProperty('type', ACTIONS.TRANSACTION_SENT);
    expect(sentAction).toHaveProperty('payload', {
      hash,
      params,
    });
    expect(sentAction).toHaveProperty('meta', { id });

    expect(receiptErrorAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_ERROR,
    );
    expect(receiptErrorAction).toHaveProperty('payload', {
      error: {
        message: 'could not get receipt',
        params,
        type: 'receipt',
      },
    });
    expect(receiptErrorAction).toHaveProperty('meta', { id });

    expect(channelEnd).toBe(END);
  });

  test('It captures events of a tx with event errors correctly', async () => {
    const receiptPromise = new Promise(resolve => resolve(receipt));
    const eventDataPromise = new Promise((resolve, reject) =>
      reject(new Error('could not get eventData')),
    );
    const txPromise = new Promise(resolve =>
      resolve({
        eventDataPromise,
        meta: {
          receiptPromise,
          transaction,
        },
      }),
    );
    const channel = transactionChannel(txPromise, tx);

    const actions = await takeAllFromChannel(channel);
    // The events should be in this order
    const [
      sentAction,
      receiptReceivedAction,
      eventDataErrorAction,
      channelEnd,
    ] = actions;
    expect(actions.length).toBe(4);

    expect(sentAction).toHaveProperty('type', ACTIONS.TRANSACTION_SENT);
    expect(sentAction).toHaveProperty('payload', {
      hash,
      params,
    });
    expect(sentAction).toHaveProperty('meta', { id });

    expect(receiptReceivedAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    );
    expect(receiptReceivedAction).toHaveProperty('payload', {
      params,
      receipt,
    });
    expect(receiptReceivedAction).toHaveProperty('meta', { id });

    expect(eventDataErrorAction).toHaveProperty(
      'type',
      ACTIONS.TRANSACTION_ERROR,
    );
    expect(eventDataErrorAction).toHaveProperty('payload', {
      error: {
        message: 'could not get eventData',
        params,
        type: 'eventData',
      },
    });
    expect(eventDataErrorAction).toHaveProperty('meta', { id });

    expect(channelEnd).toBe(END);
  });
});
