import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { middleware as actionWatchMiddleWare } from 'redux-action-watch';

import context from '~context/index';

import setupSagas from '../modules/core/sagas';
import history from './history';
import reduxPromiseListener from './createPromiseListener';
import createRootReducer from './createRootReducer';
import { createDuplicateActionGuardMiddleware } from './createDuplicateActionGuardMiddleware';
import { createSubscriberMiddleware } from './createSubscriberMiddleware';
import { ActionTypes } from './actionTypes';

const sagaMiddleware = createSagaMiddleware({ context });

/*
 * @todo Remove action black-hole Redux middlewares
 * @body We're using some custom middleware which swallows up actions. This can
 * end up being really confusing, so we should seek to remove them in favour of
 * more proper solutions.
 */

// This is symptom-fighting for #1299 and the underlying issue has not
// been resolved yet. For now, only fetch actions with a key are guarded against.
const duplicateActionGuardMiddleware = createDuplicateActionGuardMiddleware(
  300,
  ActionTypes.COLONY_ADDRESS_FETCH,
  ActionTypes.COLONY_FETCH,
  ActionTypes.COLONY_NAME_FETCH,
  ActionTypes.TASK_FETCH,
);

// Allows useDataSubsctiber to always dispatch, and prevents those actions from
// propagating while something is already being subscribed to, or other
// instances of useDataSubscriber are still reliant on a subscription.
const subscriberMiddleware = createSubscriberMiddleware([
  ActionTypes.CONNECTION_STATS_SUB_START,
  ActionTypes.CONNECTION_STATS_SUB_STOP,
]);

const composeEnhancer =
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createRootReducer(history),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      duplicateActionGuardMiddleware,
      subscriberMiddleware,
      sagaMiddleware,
      reduxPromiseListener.middleware,
      actionWatchMiddleWare('watcher'),
    ),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
