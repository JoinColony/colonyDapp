/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';

import { buildManifest } from './utils';
import common from './common';
import colony from './colony';
import task from './task';

const loadPermissionManifest = (
  colonyClient: ColonyNetworkClient.ColonyClient,
) => buildManifest(colonyClient, [common, colony, task]);

export default loadPermissionManifest;
