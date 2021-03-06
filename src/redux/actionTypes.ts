/* eslint-disable prettier/prettier, max-len */

/*
 * Please try to keep this list in alphabetical order :-)
 * (hopefully your editor can do it!)
 */
export enum ActionTypes {
  COLONY_CLAIM_TOKEN = 'COLONY_CLAIM_TOKEN',
  COLONY_CLAIM_TOKEN_ERROR = 'COLONY_CLAIM_TOKEN_ERROR',
  COLONY_CLAIM_TOKEN_SUCCESS = 'COLONY_CLAIM_TOKEN_SUCCESS',
  COLONY_CREATE = 'COLONY_CREATE',
  COLONY_CREATE_CANCEL = 'COLONY_CREATE_CANCEL',
  COLONY_CREATE_ERROR = 'COLONY_CREATE_ERROR',
  COLONY_CREATE_SUCCESS = 'COLONY_CREATE_SUCCESS',
  COLONY_DEPLOYMENT_RESTART = 'COLONY_DEPLOYMENT_RESTART',
  COLONY_DEPLOYMENT_RESTART_ERROR = 'COLONY_DEPLOYMENT_RESTART_ERROR',
  COLONY_DEPLOYMENT_RESTART_SUCCESS = 'COLONY_DEPLOYMENT_RESTART_SUCCESS',
  COLONY_RECOVERY_MODE_ENTER = 'COLONY_RECOVERY_MODE_ENTER',
  COLONY_RECOVERY_MODE_ENTER_ERROR = 'COLONY_RECOVERY_MODE_ENTER_ERROR',
  COLONY_RECOVERY_MODE_ENTER_SUCCESS = 'COLONY_RECOVERY_MODE_ENTER_SUCCESS',
  COLONY_EXTENSION_ENABLE = 'COLONY_EXTENSION_ENABLE',
  COLONY_EXTENSION_ENABLE_ERROR = 'COLONY_EXTENSION_ENABLE_ERROR',
  COLONY_EXTENSION_ENABLE_SUCCESS = 'COLONY_EXTENSION_ENABLE_SUCCESS',
  COLONY_EXTENSION_INSTALL = 'COLONY_EXTENSION_INSTALL',
  COLONY_EXTENSION_INSTALL_ERROR = 'COLONY_EXTENSION_INSTALL_ERROR',
  COLONY_EXTENSION_INSTALL_SUCCESS = 'COLONY_EXTENSION_INSTALL_SUCCESS',
  COLONY_EXTENSION_DEPRECATE= 'COLONY_EXTENSION_DEPRECATE',
  COLONY_EXTENSION_DEPRECATE_ERROR = 'COLONY_EXTENSION_DEPRECATE_ERROR',
  COLONY_EXTENSION_DEPRECATE_SUCCESS = 'COLONY_EXTENSION_DEPRECATE_SUCCESS',
  COLONY_EXTENSION_UNINSTALL = 'COLONY_EXTENSION_UNINSTALL',
  COLONY_EXTENSION_UNINSTALL_ERROR = 'COLONY_EXTENSION_UNINSTALL_ERROR',
  COLONY_EXTENSION_UNINSTALL_SUCCESS = 'COLONY_EXTENSION_UNINSTALL_SUCCESS',
  /*
   * Actions
   */
  COLONY_ACTION_DOMAIN_CREATE = 'COLONY_ACTION_DOMAIN_CREATE',
  COLONY_ACTION_DOMAIN_CREATE_ERROR = 'COLONY_ACTION_DOMAIN_CREATE_ERROR',
  COLONY_ACTION_DOMAIN_CREATE_SUCCESS = 'COLONY_ACTION_DOMAIN_CREATE_SUCCESS',
  COLONY_ACTION_DOMAIN_EDIT = 'COLONY_ACTION_DOMAIN_EDIT',
  COLONY_ACTION_DOMAIN_EDIT_ERROR = 'COLONY_ACTION_DOMAIN_EDIT_ERROR',
  COLONY_ACTION_DOMAIN_EDIT_SUCCESS = 'COLONY_ACTION_DOMAIN_EDIT_SUCCESS',
  /*
   * @NOTE These are generic actions use for placeholders
   * They are not, and should not be wired to any dispatch action
   */
  COLONY_ACTION_GENERIC = 'COLONY_ACTION_GENERIC',
  COLONY_ACTION_GENERIC_ERROR = 'COLONY_ACTION_GENERIC_ERROR',
  COLONY_ACTION_GENERIC_SUCCESS = 'COLONY_ACTION_GENERIC_SUCCESS',
  COLONY_ACTION_EXPENDITURE_PAYMENT = 'COLONY_ACTION_EXPENDITURE_PAYMENT',
  COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR = 'COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR',
  COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS = 'COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS',
  COLONY_ACTION_EDIT_COLONY = 'COLONY_ACTION_EDIT_COLONY',
  COLONY_ACTION_EDIT_COLONY_ERROR = 'COLONY_ACTION_EDIT_COLONY_ERROR',
  COLONY_ACTION_EDIT_COLONY_SUCCESS = 'COLONY_ACTION_EDIT_COLONY_SUCCESS',
  COLONY_ACTION_MINT_TOKENS = 'COLONY_ACTION_MINT_TOKENS',
  COLONY_ACTION_MINT_TOKENS_ERROR = 'COLONY_ACTION_MINT_TOKENS_ERROR',
  COLONY_ACTION_MINT_TOKENS_SUCCESS = 'COLONY_ACTION_MINT_TOKENS_SUCCESS',
  COLONY_ACTION_MOVE_FUNDS = 'COLONY_ACTION_MOVE_FUNDS',
  COLONY_ACTION_MOVE_FUNDS_ERROR = 'COLONY_ACTION_MOVE_FUNDS_ERROR',
  COLONY_ACTION_MOVE_FUNDS_SUCCESS = 'COLONY_ACTION_MOVE_FUNDS_SUCCESS',
  COLONY_ACTION_RECOVERY = 'COLONY_ACTION_RECOVERY',
  COLONY_ACTION_RECOVERY_ERROR = 'COLONY_ACTION_RECOVERY_ERROR',
  COLONY_ACTION_RECOVERY_SUCCESS = 'COLONY_ACTION_RECOVERY_SUCCESS',
  COLONY_ACTION_RECOVERY_SET_SLOT = 'COLONY_ACTION_RECOVERY_SET_SLOT',
  COLONY_ACTION_RECOVERY_SET_SLOT_ERROR = 'COLONY_ACTION_RECOVERY_SET_SLOT_ERROR',
  COLONY_ACTION_RECOVERY_SET_SLOT_SUCCESS = 'COLONY_ACTION_RECOVERY_SET_SLOT_SUCCESS',
  COLONY_ACTION_RECOVERY_APPROVE = 'COLONY_ACTION_RECOVERY_APPROVE',
  COLONY_ACTION_RECOVERY_APPROVE_ERROR = 'COLONY_ACTION_RECOVERY_APPROVE_ERROR',
  COLONY_ACTION_RECOVERY_APPROVE_SUCCESS = 'COLONY_ACTION_RECOVERY_APPROVE_SUCCESS',
  COLONY_ACTION_RECOVERY_EXIT = 'COLONY_ACTION_RECOVERY_EXIT',
  COLONY_ACTION_RECOVERY_EXIT_ERROR = 'COLONY_ACTION_RECOVERY_EXIT_ERROR',
  COLONY_ACTION_RECOVERY_EXIT_SUCCESS = 'COLONY_ACTION_RECOVERY_EXIT_SUCCESS',
  COLONY_ACTION_VERSION_UPGRADE = 'COLONY_ACTION_VERSION_UPGRADE',
  COLONY_ACTION_VERSION_UPGRADE_ERROR = 'COLONY_ACTION_VERSION_UPGRADE_ERROR',
  COLONY_ACTION_VERSION_UPGRADE_SUCCESS = 'COLONY_ACTION_VERSION_UPGRADE_SUCCESS',
  COLONY_ACTION_USER_ROLES_SET = 'COLONY_ACTION_USER_ROLES_SET',
  COLONY_ACTION_USER_ROLES_SET_ERROR = 'COLONY_ACTION_USER_ROLES_SET_ERROR',
  COLONY_ACTION_USER_ROLES_SET_SUCCESS = 'COLONY_ACTION_USER_ROLES_SET_SUCCESS',
  COLONY_ACTION_UNLOCK_TOKEN = 'COLONY_ACTION_UNLOCK_TOKEN',
  COLONY_ACTION_UNLOCK_TOKEN_ERROR = 'COLONY_ACTION_UNLOCK_TOKEN_ERROR',
  COLONY_ACTION_UNLOCK_TOKEN_SUCCESS = 'COLONY_ACTION_UNLOCK_TOKEN_SUCCESS',
  CONNECTION_STATS_SUB_ERROR = 'CONNECTION_STATS_SUB_ERROR',
  CONNECTION_STATS_SUB_EVENT = 'CONNECTION_STATS_SUB_EVENT',
  CONNECTION_STATS_SUB_START = 'CONNECTION_STATS_SUB_START',
  CONNECTION_STATS_SUB_STOP = 'CONNECTION_STATS_SUB_STOP',
  GAS_PRICES_UPDATE = 'GAS_PRICES_UPDATE',
  IPFS_DATA_FETCH = 'IPFS_DATA_FETCH',
  IPFS_DATA_FETCH_ERROR = 'IPFS_DATA_FETCH_ERROR',
  IPFS_DATA_FETCH_SUCCESS = 'IPFS_DATA_FETCH_SUCCESS',
  IPFS_DATA_UPLOAD = 'IPFS_DATA_UPLOAD',
  IPFS_DATA_UPLOAD_ERROR = 'IPFS_DATA_UPLOAD_ERROR',
  IPFS_DATA_UPLOAD_SUCCESS = 'IPFS_DATA_UPLOAD_SUCCESS',
  MESSAGE_CANCEL = 'MESSAGE_CANCEL',
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_ERROR = 'MESSAGE_ERROR',
  MESSAGE_SIGN = 'MESSAGE_SIGN',
  MESSAGE_SIGNED = 'MESSAGE_SIGNED',
  MULTISIG_TRANSACTION_CREATED = 'MULTISIG_TRANSACTION_CREATED',
  MULTISIG_TRANSACTION_REFRESHED = 'MULTISIG_TRANSACTION_REFRESHED',
  MULTISIG_TRANSACTION_REJECT = 'MULTISIG_TRANSACTION_REJECT',
  MULTISIG_TRANSACTION_SIGN = 'MULTISIG_TRANSACTION_SIGN',
  MULTISIG_TRANSACTION_SIGNED = 'MULTISIG_TRANSACTION_SIGNED',
  TOKEN_CREATE = 'TOKEN_CREATE',
  TOKEN_CREATE_ERROR = 'TOKEN_CREATE_ERROR',
  TOKEN_CREATE_SUCCESS = 'TOKEN_CREATE_SUCCESS',
  TRANSACTION_ADD_IDENTIFIER = 'TRANSACTION_ADD_IDENTIFIER',
  TRANSACTION_ADD_PARAMS = 'TRANSACTION_ADD_PARAMS',
  TRANSACTION_CANCEL = 'TRANSACTION_CANCEL',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  TRANSACTION_ESTIMATE_GAS = 'TRANSACTION_ESTIMATE_GAS',
  TRANSACTION_GAS_UPDATE = 'TRANSACTION_GAS_UPDATE',
  TRANSACTION_HASH_RECEIVED = 'TRANSACTION_HASH_RECEIVED',
  TRANSACTION_LOAD_RELATED = 'TRANSACTION_LOAD_RELATED',
  TRANSACTION_READY = 'TRANSACTION_READY',
  TRANSACTION_PENDING = 'TRANSACTION_PENDING',
  TRANSACTION_RECEIPT_RECEIVED = 'TRANSACTION_RECEIPT_RECEIVED',
  TRANSACTION_SEND = 'TRANSACTION_SEND',
  TRANSACTION_SENT = 'TRANSACTION_SENT',
  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  TRANSACTION_RETRY = 'TRANSACTION_RETRY',
  USER_ADDRESS_FETCH = 'USER_ADDRESS_FETCH',
  USER_ADDRESS_FETCH_ERROR = 'USER_ADDRESS_FETCH_ERRROR',
  USER_ADDRESS_FETCH_SUCCESS = 'USER_ADDRESS_FETCH_SUCCESS',
  USER_AVATAR_REMOVE = 'USER_AVATAR_REMOVE',
  USER_AVATAR_REMOVE_ERROR = 'USER_AVATAR_REMOVE_ERRROR',
  USER_AVATAR_REMOVE_SUCCESS = 'USER_AVATAR_REMOVE_SUCCESS',
  USER_AVATAR_UPLOAD = 'USER_AVATAR_UPLOAD',
  USER_AVATAR_UPLOAD_ERROR = 'USER_AVATAR_UPLOAD_ERRROR',
  USER_AVATAR_UPLOAD_SUCCESS = 'USER_AVATAR_UPLOAD_SUCCESS',
  USER_CONTEXT_SETUP_SUCCESS = 'USER_CONTEXT_SETUP_SUCCESS',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_ERROR = 'USER_LOGOUT_ERROR',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USERNAME_CREATE = 'USERNAME_CREATE',
  USERNAME_CREATE_ERROR = 'USERNAME_CREATE_ERROR',
  USERNAME_CREATE_SUCCESS = 'USERNAME_CREATE_SUCCESS',
  WALLET_CREATE = 'WALLET_CREATE',
  WALLET_CREATE_ERROR = 'WALLET_CREATE_ERROR',
  WALLET_CREATE_SUCCESS = 'WALLET_CREATE_SUCCESS',
}
