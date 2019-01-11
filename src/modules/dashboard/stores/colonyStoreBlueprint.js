/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import * as yup from 'yup';

import { ValidatedKVStore } from '../../../lib/database/stores';
import { ColonyAccessController } from '../../../lib/database/accessControllers';

import colonyManifest from '../../../lib/database/accessControllers/permissions/colony';
import commonManifest from '../../../lib/database/accessControllers/permissions/common';

import type { StoreBlueprint, Address } from '~types';

const colonyStoreBlueprint: StoreBlueprint = {
  getAccessController({
    colonyAddress,
    colonyClient,
    wallet,
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
  name: 'colony',
  schema: yup.object({
    id: yup.number(),
    address: yup.string().address(),
    ensName: yup.string(),
    name: yup.string(),
    description: yup.string(),
    website: yup.string().url(),
    guideline: yup.string().url(),
    // TODO: IPFS hash add yup validation for IPFS hash
    avatar: yup.string(),
    token: yup.object({
      address: yup.string().address(),
      icon: yup.string(),
      name: yup.string(),
      symbol: yup.string(),
    }),
    admins: yup.object(),
    databases: yup.object({
      domainsIndex: yup.string(),
    }),
  }),
  type: ValidatedKVStore,
};

export default colonyStoreBlueprint;
