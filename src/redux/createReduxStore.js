/* @flow */

import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { middleware as actionWatchMiddleWare } from 'redux-action-watch';

import context from '~context';
import { middleware as persistMiddleware } from './persist';

import setupSagas from '../modules/core/sagas';
import history from './history';
import reduxPromiseListener from './createPromiseListener';
import createRootReducer from './createRootReducer';
import { createDuplicateActionGuardMiddleware } from './createDuplicateActionGuardMiddleware';
import { createSubscriberMiddleware } from './createSubscriberMiddleware';
import ACTIONS from './actions';

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
  ACTIONS.COLONY_ADDRESS_FETCH,
  ACTIONS.COLONY_FETCH,
  ACTIONS.COLONY_NAME_FETCH,
  ACTIONS.TASK_FETCH,
  ACTIONS.USER_FETCH,
);

// Allows useDataSubsctiber to always dispatch, and prevents those actions from
// propagating while something is already being subscribed to, or other
// instances of useDataSubscriber are still reliant on a subscription.
const subscriberMiddleware = createSubscriberMiddleware(
  [ACTIONS.COLONY_SUB_START, ACTIONS.COLONY_SUB_STOP],
  [
    ACTIONS.COLONY_TASK_METADATA_SUB_START,
    ACTIONS.COLONY_TASK_METADATA_SUB_STOP,
  ],
  [ACTIONS.CONNECTION_STATS_SUB_START, ACTIONS.CONNECTION_STATS_SUB_STOP],
  [ACTIONS.TASK_FEED_ITEMS_SUB_START, ACTIONS.TASK_FEED_ITEMS_SUB_STOP],
  [ACTIONS.TASK_SUB_START, ACTIONS.TASK_SUB_STOP],
  [ACTIONS.USER_SUB_START, ACTIONS.USER_SUB_STOP],
  [
    ACTIONS.USER_SUBSCRIBED_COLONIES_SUB_START,
    ACTIONS.USER_SUBSCRIBED_COLONIES_SUB_STOP,
  ],
  [
    ACTIONS.USER_SUBSCRIBED_TASKS_SUB_START,
    ACTIONS.USER_SUBSCRIBED_TASKS_SUB_STOP,
  ],
);

const composeEnhancer: Function =
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
      persistMiddleware,
      actionWatchMiddleWare('watcher'),
    ),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
