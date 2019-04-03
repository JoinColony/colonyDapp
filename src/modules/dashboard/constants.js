/* @flow */

export const DASHBOARD_NAMESPACE = 'dashboard';

export const DASHBOARD_ALL_ROLES = 'allRoles';
export const DASHBOARD_ALL_COLONIES = 'allColonies';
export const DASHBOARD_ALL_COMMENTS = 'allComments';
export const DASHBOARD_ALL_DOMAINS = 'allDomains';
export const DASHBOARD_TASKS = 'tasks';
export const DASHBOARD_ALL_TOKENS = 'allTokens';
export const DASHBOARD_COLONIES = 'colonies';
export const DASHBOARD_ENS_NAMES = 'ensNames';
export const DASHBOARD_TOKEN_ICONS = 'icons';
export const DASHBOARD_TOKENS = 'tokens';

// map of mainnet token addresses to icon ipfs hashes
export const DASHBOARD_TOKEN_ICON_DEFAULTS = {
  // ETH
  '0x0000000000000000000000000000000000000000':
    'QmduyMS5CJM7QyLjX2o21rR1oaA4GqvNZoKehv4cQHfW6u',
  // DAI
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359':
    'QmZL6KjkjY523Qt68bsiSoKsuYhPgWxDKVReKRG2Eo6q6E',
};
