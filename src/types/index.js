/* @flow */

export * from '../lib/database/types';
export * from '../lib/ColonyManager/types';

export * from './records/ActivityFeedItemRecord';
export * from './records/ColonyMetaRecord';
export * from './records/ColonyRecord';
export * from './records/DomainRecord';
export * from './records/SkillRecord';
export * from './records/TaskFeedItemCommentRecord';
export * from './records/TaskFeedItemRatingRecord';
export * from './records/TaskFeedItemRecord';
export * from './records/TaskPayoutRecord';
export * from './records/TaskRecord';
export * from './records/TokenRecord';
export * from './records/TransactionRecord';
export * from './records/UserRecord';
export * from './records/UsersRecord';
export * from './records/WalletRecord';

export * from './transaction';
export * from './TransactionReceipt';

// TODO consider making this accept generics so that we can better test
// reducers: https://github.com/facebook/flow/issues/4737
export type Action = { type: string, payload: any };
export type ActionCreator = (...args: Array<any>) => Action;
