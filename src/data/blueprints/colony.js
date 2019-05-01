/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address, StoreBlueprint } from '~types';

import { EventStore } from '~lib/database/stores';
import { ColonyAccessController } from '../accessControllers';
import loadPermissionManifest from '../permissions';
import { createENSResolver } from './resolvers';

export type ColonyStoreDeps = {|
  wallet: WalletObjectType,
  colonyClient: ColonyClientType,
|};

export type ColonyStoreProps = {|
  colonyAddress: Address,
|};

export const getStoreAccessController = (
  { colonyAddress }: ColonyStoreProps,
  { colonyClient, wallet }: ColonyStoreDeps,
) => {
  if (!colonyAddress)
    throw new Error(
      // eslint-disable-next-line max-len
      `Could not create access controller, invalid colony address: "${colonyAddress}"`,
    );
  if (!wallet)
    throw new Error(
      'Could not create access controller, a wallet object is required',
    );
  if (!colonyClient)
    throw new Error(
      'Could not create access controller, colony client is required',
    );

  const manifest = loadPermissionManifest(colonyClient);
  return new ColonyAccessController(colonyAddress, wallet, manifest);
};

export type ColonyStoreBlueprint = StoreBlueprint<
  ColonyStoreProps,
  ColonyStoreDeps,
  ColonyAccessController,
>;

const resolver = createENSResolver<{ colonyAddress: Address }>();
const getColonyStoreBlueprint = (
  props: ColonyStoreProps,
  deps: ColonyStoreDeps,
): ColonyStoreBlueprint =>
  Object.freeze({
    accessController: getStoreAccessController(props, deps),
    name: `colony.${props.colonyAddress}`,
    type: EventStore,
    resolver,
    props,
    deps,
  });

export default getColonyStoreBlueprint;
