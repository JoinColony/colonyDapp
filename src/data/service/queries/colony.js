/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { ENSName } from '~types';
import type { QuerySpec } from '../../execution';

import { getStore } from '../../application/stores';
import { domainsIndexStoreBlueprint } from '../../../modules/dashboard/stores';

// TODO import these
type EventStore = {};
const queryEventStore = () => {};
const ADD_DOMAINS_STORE_REFERENCE = 'ADD_DOMAINS_STORE_REFERENCE';

export const getDomainsStoreAddress = (colonyStore: EventStore) => {
  const [
    {
      payload: { domainsStore },
    },
  ] = queryEventStore(colonyStore, {
    type: ADD_DOMAINS_STORE_REFERENCE,
  });
  return domainsStore;
};

// export const getDomainsStore: QuerySpec<
//   {
//     colonyENSName: ENSName,
//     colonyStore: EventStore,
//     ddb: DDB,
//   },
//   string,
// > = {
//   async execute({ colonyStore, colonyENSName, ddb }: *) {
//     const domainsStoreAddress = await getDomainsStoreAddress(colonyStore);
//     return getStore(ddb)(domainsIndexStoreBlueprint, domainsStoreAddress, {
//       colonyENSName,
//     });
//   },
// };
