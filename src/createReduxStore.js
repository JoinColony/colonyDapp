/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { all } from 'redux-saga/effects';

import walletReducer from './modules/wallet/reducers';

import walletSagas from './modules/wallet/sagas';
import colonySagas from './modules/dashboard/sagas';
import history from './history';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

function* rootSaga(): any {
  yield all([walletSagas(), colonySagas()]);
}

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;
