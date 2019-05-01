/* @flow */

import {
  colonyAddressSelector,
  colonyDomainsSelector,
  colonyNameSelector,
  colonyRolesSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  taskFeedItemsSelector,
  tasksByIdsSelector,
  taskSelector,
  tokenSelector,
} from './selectors';
import {
  currentUserColoniesSelector,
  currentUserDraftIdsSelector,
} from '../users/selectors';
import {
  fetchColony,
  fetchColonyAddress,
  fetchColonyName,
  fetchDomains,
  fetchRoles,
  fetchTask,
  fetchTaskByColonyAddressAndDraftId,
  fetchTaskFeedItems,
  fetchToken,
  fetchColonyTaskMetadata,
} from './actionCreators';
import {
  currentUserFetchColonies,
  currentUserFetchTasks,
} from '../users/actionCreators';

export const colonyFetcher = Object.freeze({
  select: colonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
});

export const colonyAddressFetcher = Object.freeze({
  select: colonyAddressSelector,
  fetch: fetchColonyAddress,
  ttl: 1000 * 60, // 1 minute
});

export const colonyNameFetcher = Object.freeze({
  select: colonyNameSelector,
  fetch: fetchColonyName,
  ttl: 1000 * 60, // 1 minute
});

export const domainsFetcher = Object.freeze({
  select: colonyDomainsSelector,
  fetch: fetchDomains,
  ttl: 1000 * 60, // 1 minute,
});

export const rolesFetcher = Object.freeze({
  select: colonyRolesSelector,
  fetch: fetchRoles,
  ttl: 1000 * 60,
});

export const currentUserDraftIdsFetcher = Object.freeze({
  select: currentUserDraftIdsSelector,
  fetch: currentUserFetchTasks,
  ttl: 1000 * 60,
});

export const currentUserColoniesFetcher = Object.freeze({
  select: currentUserColoniesSelector,
  fetch: currentUserFetchColonies,
  ttl: 1000 * 60,
});

export const taskFetcher = Object.freeze({
  select: taskSelector,
  fetch: fetchTask,
  ttl: 1000 * 60, // 1 minute,
});

export const tasksByIdFetcher = Object.freeze({
  select: tasksByIdsSelector,
  fetch: fetchTaskByColonyAddressAndDraftId,
  ttl: 1000 * 60, // 1 minute,
});

export const colonyTaskMetadataFetcher = Object.freeze({
  select: colonyTaskMetadataSelector,
  fetch: fetchColonyTaskMetadata,
  ttl: 1000 * 60, // 1 minute,
});

export const tokenFetcher = Object.freeze({
  select: tokenSelector,
  fetch: fetchToken,
  ttl: 1000 * 60,
});

export const taskFeedItemsFetcher = Object.freeze({
  select: taskFeedItemsSelector,
  fetch: fetchTaskFeedItems,
  ttl: 1000 * 60,
});
