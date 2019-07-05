/* @flow */

import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';

import context from '~context';
import { middleware as persistMiddleware } from './persist';

import setupSagas from '../modules/core/sagas';
import history from './history';
import reduxPromiseListener from './createPromiseListener';
import createRootReducer from './createRootReducer';
import { createDuplicateActionGuardMiddleware } from './createDuplicateActionGuardMiddleware';
import ACTIONS from './actions';

const sagaMiddleware = createSagaMiddleware({ context });

// This is symptom-fighting for #1299 and the underlying issue has not
// been resolved yet. For now, only fetch actions with a key are guarded against.
const duplicateActionGuardMiddleware = createDuplicateActionGuardMiddleware(
  300,
  ACTIONS.COLONY_ADDRESS_FETCH,
  ACTIONS.COLONY_FETCH,
  ACTIONS.COLONY_NAME_FETCH,
  ACTIONS.TASK_FETCH,
  ACTIONS.USER_BY_USERNAME_FETCH,
  ACTIONS.USER_FETCH,
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
      sagaMiddleware,
      reduxPromiseListener.middleware,
      persistMiddleware,
    ),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
