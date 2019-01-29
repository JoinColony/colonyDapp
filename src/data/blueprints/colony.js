/* @flow */

import { EventStore } from '../../lib/database/stores';
import { getAttributesBasedStoreAccessController } from '../accessControllers';

import type { StoreBlueprint } from '~types';

const colonyStoreBlueprint: StoreBlueprint = {
  getAccessController: getAttributesBasedStoreAccessController,
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
