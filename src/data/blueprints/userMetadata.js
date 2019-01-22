/* @flow */

import type { StoreBlueprint } from '~types/index';
import { EventStore } from '../../lib/database/stores';
import { EthereumWalletAccessController } from '../../lib/database/accessControllers';

type StoreProps = {
  walletAddress: string,
};

const userMetadataStore: StoreBlueprint = {
  getAccessController({ walletAddress }: StoreProps = {}) {
    return new EthereumWalletAccessController(walletAddress);
  },
  name: 'userMetadata',
  type: EventStore,
};

export default userMetadataStore;
