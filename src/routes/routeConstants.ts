// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

export const CONNECT_ROUTE = '/connect';
export const COLONY_HOME_ROUTE = '/colony/:colonyName';
export const COLONY_EVENTS_ROUTE = `${COLONY_HOME_ROUTE}/events`;
export const COLONY_FUNDING_ROUTE = `${COLONY_HOME_ROUTE}/funds`;
export const COLONY_EXTENSIONS_ROUTE = `${COLONY_HOME_ROUTE}/extensions`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `${COLONY_HOME_ROUTE}/extensions/:extensionId`;
export const COLONY_EXTENSION_SETUP_ROUTE = `${COLONY_EXTENSION_DETAILS_ROUTE}/setup`;
export const MEMBERS_ROUTE = `${COLONY_HOME_ROUTE}/members/:domainId?`;
export const CREATE_COLONY_ROUTE = '/create-colony';
export const CREATE_USER_ROUTE = '/create-user';
export const INBOX_ROUTE = '/inbox';
export const USER_EDIT_ROUTE = '/edit-profile';
export const USER_ROUTE = '/user/:username';
export const WALLET_ROUTE = '/wallet';
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/landing';
export const ACTIONS_PAGE_ROUTE = `${COLONY_HOME_ROUTE}/tx/:transactionHash`;
export const UNWRAP_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/unwrap-tokens`;
export const CLAIM_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/claim-tokens`;
