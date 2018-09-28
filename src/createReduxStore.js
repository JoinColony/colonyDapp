/* @flow */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import walletReducer from './modules/wallet/reducers';

import walletSagas from './modules/wallet/sagas';
import colonySagas from './modules/dashboard/sagas';
import { dataReducer, dataSagas } from './data';
import { initializeData } from './actions';

const rootReducer = combineReducers({
  wallet: walletReducer,
  data: dataReducer,
});

function* rootSaga(): any {
  yield [walletSagas(), colonySagas(), dataSagas()];
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

const rootRepo = '/tmp/dataTests';
initializeData(store.dispatch, rootRepo).then(result => console.log(result));

export default store;
