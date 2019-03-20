/* @flow */

import type {
  Collection as CollectionType,
  Map as ImmutableMapType,
  List as ListType,
  Set as ImmutableSetType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';
import type { AllColoniesRecord } from './AllColonies';
import type { AllTokensRecord } from './AllTokens';
import type { DataRecordType } from '../../Data';
import type { DomainRecordType } from '../../Domain';
import type { TaskCommentRecordType } from '../../TaskComment';
import type { TaskDraftId } from '../../Task';
import type { TaskReferenceRecordType } from '../../TaskReference';

export * from './AllColonies';
export * from './AllTokens';

export type DomainsSet = ImmutableSetType<DomainRecordType>;
export type AllDomainsMap = ImmutableMapType<
  ENSName,
  DataRecordType<DomainsSet>,
>;
export type CommentsList = ListType<TaskCommentRecordType>;
export type AllCommentsMap = ImmutableMapType<TaskDraftId, CommentsList>;

export type TaskRefsMap = ImmutableMapType<
  TaskDraftId,
  DataRecordType<?TaskReferenceRecordType>,
>;

export type DashboardStateProps = {|
  allColonies: AllColoniesRecord,
  allComments: AllCommentsMap,
  allDomains: AllDomainsMap,
  allTokens: AllTokensRecord,
  tasks: TaskRefsMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type DashboardStateRecord = CollectionType<*, *> &
  RecordOf<DashboardStateProps>;
