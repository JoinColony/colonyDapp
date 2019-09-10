import ColonyNetworkClient from '@colony/colony-js-client';

import { buildManifest } from './utils';
import COMMON from './common';
import COLONY from './colony';
import TASK from './task';

export { default as PermissionManager } from './PermissionManager';

export const MANIFEST_LOADERS = Object.freeze({
  COMMON,
  COLONY,
  TASK,
});

const loadPermissionManifest = (
  colonyClient: ColonyNetworkClient.ColonyClient,
  manifestLoaders: typeof MANIFEST_LOADERS[keyof typeof MANIFEST_LOADERS][],
) => buildManifest(colonyClient, manifestLoaders);

export default loadPermissionManifest;
