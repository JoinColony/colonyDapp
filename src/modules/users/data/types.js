/* @flow */
import type { OrbitDBAddress } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  ENSCacheContext,
  IPFSContext,
  NetworkClientContext,
  Query,
} from '~data/types';

type UserQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext,
>;

type UserMetadataQueryContext = ContextWithMetadata<
  {|
    userMetadataStoreAddress: string | OrbitDBAddress,
    walletAddress: string,
  |},
  DDBContext,
>;

type UserAvatarQueryContext = ContextWithMetadata<
  {| avatarIpfsHash: string |},
  IPFSContext,
>;

type UserBalanceQueryContext = NetworkClientContext;
type UserPermissionsQueryContext = ColonyClientContext;

type UserTokensQueryContext = ContextWithMetadata<
  {|
    userMetadataStoreAddress: string | OrbitDBAddress,
    walletAddress: string,
  |},
  DDBContext & NetworkClientContext,
>;

type UserColonyTransactionsQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
  |},
  ColonyClientContext,
>;

type UsernameQueryContext = {| ...ENSCacheContext, ...NetworkClientContext |};

export type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;
export type UserMetadataQuery<I: *, R: *> = Query<
  UserMetadataQueryContext,
  I,
  R,
>;
export type UsernameQuery<I: *, R: *> = Query<UsernameQueryContext, I, R>;
export type UserPermissionsQuery<I: *, R: *> = Query<
  UserPermissionsQueryContext,
  I,
  R,
>;
export type UserTokensQuery<I: *, R: *> = Query<UserTokensQueryContext, I, R>;

export type UserColonyTransactionsQuery<I: *> = Query<
  UserColonyTransactionsQueryContext,
  I,
  ContractTransactionType[],
>;

export type UserAvatarQuery = Query<UserAvatarQueryContext, void, ?string>;
export type UserBalanceQuery = Query<UserBalanceQueryContext, string, string>;
