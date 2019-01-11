/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';
import { ColonyAccessController } from '../../../lib/database/accessControllers';
import colonyManifest from '../../../lib/database/accessControllers/permissions/colony';
import commonManifest from '../../../lib/database/accessControllers/permissions/common';

import { colonyMeta } from './meta';

import type { Address, StoreBlueprint } from '~types';

const domainsIndexStoreBlueprint: StoreBlueprint = {
  getAccessController({
    colonyAddress,
    wallet,
    colonyClient,
  }: {
    colonyAddress: Address,
    wallet: WalletObjectType,
    colonyClient: ColonyClientType,
  }) {
    const colony = colonyManifest();
    const common = commonManifest(colonyClient);
    return new ColonyAccessController(
      colonyAddress,
      wallet,
      Object.assign({}, common, colony),
    );
  },
  name: 'domainsIndex',
  schema: yup.object({
    meta: colonyMeta,
    doc: {
      name: yup.string(),
      databases: yup.object({
        tasksIndex: yup.string(),
      }),
    },
  }),
  type: DocStore,
};

export default domainsIndexStoreBlueprint;
