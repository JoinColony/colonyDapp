import { Resolvers } from '@apollo/client';

import apolloCache from './cache';

import {
  ColonyProfileFragment,
  ColonyTransfersQuery,
  DomainFieldsFragment,
  FullColonyFragment,
  LoggedInUserDocument,
  PayoutsFragment,
  TaskQuery,
  TokenBalancesForDomainsQuery,
  TokenQuery,
  UserNotificationsQuery,
  UserQuery,
  UserTasksQuery,
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
import { taskResolvers } from './resolvers/task';
import {
  networkContractsResolvers,
  initialCache as networkContracts,
} from './resolvers/networkContracts';
import { colonyActionsResolvers } from './resolvers/colonyActions';
import { metaColonyResolvers } from './resolvers/metacolony';
import { eventsResolvers } from './resolvers/events';
import { recoveryModeResolvers } from './resolvers/recovery';

import { FixedToken } from '../types';

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
  taskResolvers,
  tokenResolvers,
  networkContractsResolvers,
  colonyActionsResolvers,
  metaColonyResolvers,
  eventsResolvers,
  recoveryModeResolvers,
];

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

export type AnyUser = UserQuery['user'] | UserWithReputationQuery['user'];

export type AnyTask =
  | TaskQuery['task']
  | UserTasksQuery['user']['tasks'][number];

export type Payouts = PayoutsFragment['payouts'];

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
)[];

// Almost all tokens with 'address' and 'iconHash'
export type AnyToken = ColonyTokens[0] | UserTokens[0] | OneToken | FixedToken;

export type TransactionMessage = TransactionMessageFragment;
export type TransactionsMessagesCount = TransactionMessagesCountQuery['transactionMessagesCount'];

export type EventOrMessage = ParsedEvent | TransactionMessage;
