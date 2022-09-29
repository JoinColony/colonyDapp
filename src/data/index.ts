import { Resolvers } from '@apollo/client';

import apolloCache from './cache';

import {
  ColonyProfileFragment,
  ColonyTransfersQuery,
  DomainFieldsFragment,
  FullColonyFragment,
  LoggedInUserDocument,
  TokenBalancesForDomainsQuery,
  TokenQuery,
  UserNotificationsQuery,
  UserQuery,
  UserToken,
  UserTokensQuery,
  UserWithReputationQuery,
  UserColoniesQuery,
  NetworkContractsDocument,
  TransactionMessageFragment,
  ParsedEvent,
  TransactionMessagesCountQuery,
  ProcessedColonyQuery,
} from './generated';
import {
  loggedInUserResolvers,
  initialCache as loggedInUser,
} from './resolvers/loggedInUser';
import { colonyResolvers } from './resolvers/colony';
import { userResolvers } from './resolvers/user';
import { tokenResolvers } from './resolvers/token';
import {
  networkContractsResolvers,
  initialCache as networkContracts,
} from './resolvers/networkContracts';
import { colonyActionsResolvers } from './resolvers/colonyActions';
import { metaColonyResolvers } from './resolvers/metacolony';
import { eventsResolvers } from './resolvers/events';
import { recoveryModeResolvers } from './resolvers/recovery';
import { extensionsResolvers } from './resolvers/extensions';
import { motionsResolvers } from './resolvers/motions';
import { vestingResolvers } from './resolvers/vesting';
/*
 * @TODO This needs to be merged with the motions resolvers
 */
import { stakesResolvers } from './resolvers/stakes';

import { FixedToken, SafeBalanceToken } from '../types';

type ResolverFactory = (context?: any) => Resolvers;

// Initialize cache
apolloCache.writeQuery({ query: LoggedInUserDocument, data: loggedInUser });
apolloCache.writeQuery({
  query: NetworkContractsDocument,
  data: networkContracts,
});

export { default as cache } from './cache';
export { default as cacheUpdates } from './cacheUpdates';
export { default as typeDefs } from './graphql/typeDefs';
export const resolvers: ResolverFactory[] = [
  colonyResolvers,
  loggedInUserResolvers,
  userResolvers,
  tokenResolvers,
  networkContractsResolvers,
  colonyActionsResolvers,
  metaColonyResolvers,
  eventsResolvers,
  recoveryModeResolvers,
  extensionsResolvers,
  motionsResolvers,
  stakesResolvers,
  vestingResolvers,
];

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

export type AnyUser = UserQuery['user'] | UserWithReputationQuery['user'];

export type Notifications = UserNotificationsQuery['user']['notifications'];
export type OneNotification = Notifications[number];

export type AnyColonyProfile =
  | FullColonyFragment
  | ColonyProfileFragment
  | UserColoniesQuery['user']['processedColonies'][number];
export type Colony = FullColonyFragment;

export type OneDomain = DomainFieldsFragment;

export type ColonyTransaction = ColonyTransfersQuery['processedColony']['transfers'][number];

export type OneToken = TokenQuery['token'];
export type ColonyTokens = ProcessedColonyQuery['processedColony']['tokens'];
export type UserTokens = UserTokensQuery['user']['tokens'];
// All tokens with either 'balance' or 'balances'
export type TokenWithBalances =
  | ColonyTokens[0]
  | UserTokens[0]
  | TokenBalancesForDomainsQuery['tokens'][0];

// See: https://github.com/microsoft/TypeScript/issues/10620
export type AnyTokens = (
  | ColonyTokens[number]
  | UserTokens[number]
  | OneToken
  | FixedToken
  | UserToken
)[];

export type AnyToken =
  | ColonyTokens[0]
  | UserTokens[0]
  | OneToken
  | FixedToken
  | UserToken
  | SafeBalanceToken;

export type TransactionMessage = TransactionMessageFragment;
export type TransactionsMessagesCount = TransactionMessagesCountQuery['transactionMessagesCount'];

export type EventOrMessage = ParsedEvent | TransactionMessage;
