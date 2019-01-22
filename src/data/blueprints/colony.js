/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import { EventStore } from '../../lib/database/stores';
import { ColonyAccessController } from '../../lib/database/accessControllers';
import loadPermissionManifest from '../../lib/database/accessControllers/permissions';

import type { Address, StoreBlueprint } from '~types';

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
    const manifest = loadPermissionManifest(colonyClient);
    return new ColonyAccessController(colonyAddress, wallet, manifest);
  },
  name: 'colony',
  type: EventStore,
  // schema: yup.object({
  //   id: yup.number(),
  //   address: yup.string().address(),
  //   ensName: yup.string(),
  //   name: yup.string(),
  //   description: yup.string(),
  //   website: yup.string().url(),
  //   guideline: yup.string().url(),
  //   // TODO: IPFS hash add yup validation for IPFS hash
  //   avatar: yup.string(),
  //   token: yup.object({
  //     address: yup.string().address(),
  //     icon: yup.string(),
  //     name: yup.string(),
  //     symbol: yup.string(),
  //   }),
  //   admins: yup.object(),
  //   databases: yup.object({
  //     domainsIndex: yup.string(),
  //   }),
  // }),
};

export default colonyStoreBlueprint;
