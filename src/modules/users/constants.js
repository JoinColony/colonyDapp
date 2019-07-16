/* @flow */

export const USERS_NAMESPACE = 'users';

export const USERS_ALL_USERS = 'allUsers';
export const USERS_COLONIES = 'colonies';
export const USERS_CURRENT_USER = 'currentUser';
export const USERS_CURRENT_USER_PROFILE = 'profile';
export const USERS_CURRENT_USER_TOKENS = 'tokens';
export const USERS_CURRENT_USER_TRANSACTIONS = 'transactions';
export const USERS_CURRENT_USER_PERMISSIONS = 'permissions';
export const USERS_INBOX_ITEMS = 'activities';
export const USERS_CURRENT_USER_TASKS = 'tasks';
export const USERS_CURRENT_USER_NOTIFICATION_METADATA = 'notifications';
export const USERS_WALLET = 'wallet';
export const USERS_USERS = 'users';

/**
 * @note The number of extra addresses to 'open' when opening a hardware wallet
 * @todo Determine proper `addressCount` for fetching wallet accounts.
 */
export const HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT = 100;
