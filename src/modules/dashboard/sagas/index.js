/* @flow */

import colonySagas from './colony';

export default function* rootSaga(): any {
  yield [colonySagas()];
}
