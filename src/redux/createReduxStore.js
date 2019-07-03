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

const sagaMiddleware = createSagaMiddleware({ context });

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createRootReducer(history),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      reduxPromiseListener.middleware,
      persistMiddleware,
    ),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
