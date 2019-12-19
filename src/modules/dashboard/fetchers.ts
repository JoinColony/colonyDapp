import {
  colonyDomainsSelector,
  TEMP_userHasRecoveryRoleSelector,
} from './selectors';
import {
  fetchDomains,
  fetchDomainsAndRoles,
  TEMP_fetchUserHasRecoveryRole,
} from './actionCreators';

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
