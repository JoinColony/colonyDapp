import {
  colonyAddressSelector,
  colonyDomainsSelector,
  colonyNameSelector,
  colonySelector,
  tokenSelector,
  TEMP_userHasRecoveryRoleSelector,
} from './selectors';
import {
  fetchColony,
  fetchColonyAddress,
  fetchColonyName,
  fetchDomains,
  fetchDomainsAndRoles,
  fetchToken,
  TEMP_fetchUserHasRecoveryRole,
} from './actionCreators';

export const colonyFetcher = Object.freeze({
  select: colonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60,
});

export const colonyAddressFetcher = Object.freeze({
  select: colonyAddressSelector,
  fetch: fetchColonyAddress,
  ttl: 1000 * 60,
});

export const colonyNameFetcher = Object.freeze({
  select: colonyNameSelector,
  fetch: fetchColonyName,
  ttl: 1000 * 60,
});

export const domainsFetcher = Object.freeze({
  select: colonyDomainsSelector,
  fetch: fetchDomains,
  ttl: 1000 * 60,
});

export const domainsAndRolesFetcher = Object.freeze({
  select: colonyDomainsSelector,
  fetch: fetchDomainsAndRoles,
  ttl: 1000 * 60,
});

export const TEMP_userHasRecoveryRoleFetcher = Object.freeze({
  select: TEMP_userHasRecoveryRoleSelector,
  fetch: TEMP_fetchUserHasRecoveryRole,
  ttl: 0,
});

export const tokenFetcher = Object.freeze({
  select: tokenSelector,
  fetch: fetchToken,
  ttl: 1000 * 60,
});
