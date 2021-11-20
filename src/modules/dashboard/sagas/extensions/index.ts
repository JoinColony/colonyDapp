import { call, all } from 'redux-saga/effects';

import colonyExtensionInstallSaga from './colonyExtensionInstall';
import colonyExtensionEnableSaga from './colonyExtensionEnable';
import colonyExtensionDeprecateSaga from './colonyExtensionDeprecate';
import colonyExtensionUninstallSaga from './colonyExtensionUninstall';
import colonyExtensionUpgradeSaga from './colonyExtensionUpgrade';

export default function* extensionsSagas() {
  yield all([
    call(colonyExtensionUpgradeSaga),
    call(colonyExtensionUninstallSaga),
    call(colonyExtensionInstallSaga),
    call(colonyExtensionEnableSaga),
    call(colonyExtensionDeprecateSaga),
  ]);
}
