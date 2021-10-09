import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import setupSagas from '../modules/core/sagas';
import reduxPromiseListener from './createPromiseListener';
import createRootReducer from './createRootReducer';

const sagaMiddleware = createSagaMiddleware();

/*
 * @todo Remove action black-hole Redux middlewares
 * @body We're using some custom middleware which swallows up actions. This can
 * end up being really confusing, so we should seek to remove them in favour of
 * more proper solutions.
 */

const composeEnhancer =
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createRootReducer(),
  composeEnhancer(
    applyMiddleware(sagaMiddleware, reduxPromiseListener.middleware),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
