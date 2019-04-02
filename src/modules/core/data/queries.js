/* @flow */
import { formatEther } from 'ethers/utils';

import type { UserProfileType } from '~immutable';

import type {
  ContextWithMetadata,
  DDBContext,
  NetworkClientContext,
  Query,
} from '~data/types';

import { getUserProfileStore } from '~data/stores';

type UserQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext,
>;

type UserBalanceQueryContext = NetworkClientContext;

type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;

export const getUserProfile: UserQuery<void, UserProfileType> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const {
      avatar,
      bio,
      displayName,
      location,
      username,
      walletAddress,
      website,
    } = await profileStore.all();
    return {
      avatar,
      bio,
      displayName,
      location,
      username,
      walletAddress,
      website,
    };
  },
});

// TODO consider merging this query with `getUserProfile`
export const getUserMetadata: UserQuery<void, *> = ({ ddb, metadata }) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const inboxStoreAddress = profileStore.get('inboxStoreAddress');
    const metadataStoreAddress = profileStore.get('metadataStoreAddress');

    // Flow hack: Should not happen, here to appease flow
    if (!(inboxStoreAddress && metadataStoreAddress))
      throw new Error('User metadata not found');

    return {
      inboxStoreAddress,
      metadataStoreAddress,
      profileStoreAddress: profileStore.address.toString(),
    };
  },
});

export const getUserBalance: Query<UserBalanceQueryContext, string, string> = ({
  networkClient,
}) => ({
  async execute(walletAddress) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
});
