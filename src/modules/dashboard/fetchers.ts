import {
  colonyAddressSelector,
  colonyDomainsSelector,
  colonyNameSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  tasksByIdsSelector,
  taskSelector,
  tokenSelector,
} from './selectors';
import {
  userColoniesSelector,
  currentUserDraftIdsSelector,
} from '../users/selectors';
import {
  fetchColony,
  fetchColonyAddress,
  fetchColonyName,
  fetchDomains,
  fetchTask,
  fetchTaskByColonyAddressAndDraftId,
  fetchToken,
  fetchColonyTaskMetadata,
} from './actionCreators';
import {
  fetchUserColonies,
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

export const currentUserDraftIdsFetcher = Object.freeze({
  select: currentUserDraftIdsSelector,
  fetch: currentUserFetchTasks,
  ttl: 1000 * 60,
});

export const userColoniesFetcher = Object.freeze({
  select: userColoniesSelector,
  fetch: fetchUserColonies,
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
