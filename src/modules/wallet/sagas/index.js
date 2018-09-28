/* @flow */
import { all } from 'redux-saga/effects';

import walletSagas from './wallet';

export default function* rootSaga(): any {
  yield all([walletSagas()]);
}
