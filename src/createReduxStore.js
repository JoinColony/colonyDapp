/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { all } from 'redux-saga/effects';

import context from '~context/';

import coreReducer from './modules/core/reducers';
import userReducer from './modules/users/reducers';

import dashboardSagas from './modules/dashboard/sagas';
import coreSagas from './modules/core/sagas';
import userSagas from './modules/users/sagas';
import history from './history';

import reduxPromiseListener from './createPromiseListener';

const rootReducer = combineReducers({
  core: coreReducer,
  user: userReducer,
});

function* rootSaga(): any {
  yield all([userSagas(), dashboardSagas(), coreSagas()]);
}

const sagaMiddleware = createSagaMiddleware({ context });

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      reduxPromiseListener.middleware,
    ),
  ),
);

sagaMiddleware.run(rootSaga);

export default store;
