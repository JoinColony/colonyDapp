/* @flow */

import walletSagas from './wallet';

export default function* rootSaga(): any {
  yield [walletSagas()];
}
