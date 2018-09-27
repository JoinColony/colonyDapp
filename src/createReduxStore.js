/* @flow */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import walletReducer from './modules/wallet/reducers';

import walletSagas from './modules/wallet/sagas';
import colonySagas from './modules/dashboard/sagas';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

function* rootSaga(): any {
  yield [walletSagas(), colonySagas()];
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

export default store;
