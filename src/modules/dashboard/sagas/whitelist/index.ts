import { all, call } from 'redux-saga/effects';

import signAgreement from './signAgreement';
import updateWhitelistSaga from './updateWhitelist';
import extensionEnableSaga from './extensionEnable';
import manageVerifiedRecipientsSaga from './manageVerifiedRecipients';

export default function* whitelistSagas() {
  yield all([
    call(signAgreement),
    call(updateWhitelistSaga),
    call(extensionEnableSaga),
    call(manageVerifiedRecipientsSaga),
  ]);
}
