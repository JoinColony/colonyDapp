/* @flow */

import type { EventChannel, Saga } from 'redux-saga';

import { buffers, END, eventChannel } from 'redux-saga';
import { fork, put, take, takeEvery } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';
import { putError } from './effects';
import QueryExecution from '~lib/ColonyData/QueryExecution';
import ColonyData from '~lib/ColonyData/ColonyData';

type SubscriptionActions = {|
  error: string,
  events: string,
  start: string,
  stop: string,
|};

export const subscriptionChannel = <R>(
  execution: QueryExecution,
): EventChannel<R | typeof END> =>
  eventChannel(emitter => {
    let subscription;
    try {
      // `tap` is used over `subscribe` because the reducer is also defined
      // in redux; this duplication should be removed.
      subscription = execution.tap({
        complete: () => emitter(END),
        error: caughtError => {
          throw caughtError;
        },
        next: emitter,
      });
    } catch (caughtError) {
      emitter(END);
      throw caughtError;
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, buffers.expanding());

export const takeSubscription = (
  actions: SubscriptionActions,
  queryName: $Keys<$PropertyType<ColonyData, 'queries'>>,
  getQueryArgs: (action: Object) => {| args?: *, metadata: * |},
) =>
  takeEvery(actions.start, function* subscriptionSaga(action: *): Saga<void> {
    let channel;
    try {
      const colonyData = yield* getContext(CONTEXT.COLONY_DATA);
      const query = colonyData.queries[queryName];
      const queryExecution = query(getQueryArgs(action));

      channel = subscriptionChannel(queryExecution);

      yield fork(function* stopSubscription() {
        yield take(
          ({ type, payload }) =>
            type === actions.stop &&
            Object.entries(payload).every(
              ([key, value]) => action.payload[key] === value,
            ),
        );
        channel.close();
      });

      while (true) {
        const events = yield take(channel);
        yield put({
          type: actions.events,
          meta: action.meta,
          payload: {
            ...action.payload,
            events,
          },
        });
      }
    } catch (caughtError) {
      yield putError(actions.error, caughtError, action.meta);
    } finally {
      if (channel && typeof channel.close == 'function') {
        channel.close();
      }
    }
  });
