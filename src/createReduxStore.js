/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { all } from 'redux-saga/effects';

import context from '~context/';

import coreReducer from './modules/core/reducers';
import userReducer from './modules/user/reducers';

import dashboardSagas from './modules/dashboard/sagas';
import coreSagas from './modules/core/sagas';
import userSagas from './modules/user/sagas';

import history from './history';

import { DDB, SCHEMAS } from './lib/database';
import ipfsNode from './lib/ipfsNode';

import reduxPromiseListener from './createPromiseListener';

DDB.registerSchema('userProfile', SCHEMAS.UserProfile);

const rootReducer = combineReducers({
  user: userReducer,
  core: coreReducer,
});

function* rootSaga(): any {
  yield all([userSagas(), dashboardSagas(), coreSagas()]);
}

// TODO: this is bad, refactor!
context.DDB = DDB;
context.ipfsNode = ipfsNode;

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
