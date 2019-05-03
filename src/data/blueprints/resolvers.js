/* @flow */

import type {
  DDB,
  ENSCache,
  NetworkClient,
  StoreBlueprint,
  StoreAddressResolverFn,
} from '~data/types';

export const storePropsResolver = {
  id: '*',
  handler: (ddb: DDB) => (props: Object, blueprint: StoreBlueprint<*, *>) =>
    blueprint &&
    blueprint.deterministicAddress &&
    ddb.generateStoreAddress(blueprint, props),
};

export const createENSResolver = <P>(): StoreAddressResolverFn<P> => ({
  id: 'ENS',
  handler: (ens: ENSCache, networkClient: NetworkClient) => (
    identifier: string,
  ) => ens.getOrbitDBAddress(identifier, networkClient),
});
