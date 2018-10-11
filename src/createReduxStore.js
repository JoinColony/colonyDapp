/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { all } from 'redux-saga/effects';

import walletReducer from './modules/wallet/reducers';

import dashboardSagas from './modules/dashboard/sagas';
import walletSagas from './modules/wallet/sagas';
import coreSagas from './modules/core/sagas';
import history from './history';

import context from '~context/';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

function* rootSaga(): any {
  yield all([walletSagas(), coreSagas(), dashboardSagas()]);
}

const sagaMiddleware = createSagaMiddleware({ context });

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;
