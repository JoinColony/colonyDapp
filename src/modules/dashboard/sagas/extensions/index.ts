import { takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/index';

import { colonyExtensionInstall } from './colonyExtensionInstall';
import { colonyExtensionEnable } from './colonyExtensionEnable';
import { colonyExtensionDeprecate } from './colonyExtensionDeprecate';
import { colonyExtensionUninstall } from './colonyExtensionUninstall';
import { colonyExtensionUpgrade } from './colonyExtensionUpgrade';
import { updateWhitelist } from './updateWhitelist';

export default function* colonyExtensionsSagas() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_INSTALL, colonyExtensionInstall);
  yield takeEvery(ActionTypes.COLONY_EXTENSION_ENABLE, colonyExtensionEnable);
  yield takeEvery(
    ActionTypes.COLONY_EXTENSION_DEPRECATE,
    colonyExtensionDeprecate,
  );
  yield takeEvery(
    ActionTypes.COLONY_EXTENSION_UNINSTALL,
    colonyExtensionUninstall,
  );
  yield takeEvery(ActionTypes.COLONY_EXTENSION_UPGRADE, colonyExtensionUpgrade);
  yield takeEvery(ActionTypes.WHITELIST_UPDATE, updateWhitelist);
}
