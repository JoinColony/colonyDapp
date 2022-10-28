import { all, call } from 'redux-saga/effects';

import manageVerifiedRecipientsSaga from './manageVerifiedRecipients';

export default function* whitelistSagas() {
  yield all([call(manageVerifiedRecipientsSaga)]);
}
