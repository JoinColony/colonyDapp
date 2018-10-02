/* @flow */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import walletReducer from './modules/wallet/reducers';

import coreSagas from './modules/core/sagas';
import walletSagas from './modules/wallet/sagas';
import colonySagas from './modules/dashboard/sagas';

import context from '~context/';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

function* rootSaga(): any {
  yield all([coreSagas(), walletSagas(), colonySagas()]);
}

const sagaMiddleware = createSagaMiddleware({ context });

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

export default store;
