/* eslint-disable prettier/prettier, max-len */

/*
 * Please try to keep this list in alphabetical order :-)
 * (hopefully your editor can do it!)
 */
export enum ActionTypes {
  /*
   * Colony Related (create, recovery, etc)
   */
  CLAIM_TOKEN = 'CLAIM_TOKEN',
  CLAIM_TOKEN_ERROR = 'CLAIM_TOKEN_ERROR',
  CLAIM_TOKEN_SUCCESS = 'CLAIM_TOKEN_SUCCESS',
  CREATE = 'CREATE',
  CREATE_CANCEL = 'CREATE_CANCEL',
  CREATE_ERROR = 'CREATE_ERROR',
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  DEPLOYMENT_RESTART = 'DEPLOYMENT_RESTART',
  DEPLOYMENT_RESTART_ERROR = 'DEPLOYMENT_RESTART_ERROR',
  DEPLOYMENT_RESTART_SUCCESS = 'DEPLOYMENT_RESTART_SUCCESS',
  RECOVERY_MODE_ENTER = 'RECOVERY_MODE_ENTER',
  RECOVERY_MODE_ENTER_ERROR = 'RECOVERY_MODE_ENTER_ERROR',
  RECOVERY_MODE_ENTER_SUCCESS = 'RECOVERY_MODE_ENTER_SUCCESS',
  /*
   * Extensions
   */
  EXTENSION_ENABLE = 'EXTENSION_ENABLE',
  EXTENSION_ENABLE_ERROR = 'EXTENSION_ENABLE_ERROR',
  EXTENSION_ENABLE_SUCCESS = 'EXTENSION_ENABLE_SUCCESS',
  EXTENSION_INSTALL = 'EXTENSION_INSTALL',
  EXTENSION_INSTALL_ERROR = 'EXTENSION_INSTALL_ERROR',
  EXTENSION_INSTALL_SUCCESS = 'EXTENSION_INSTALL_SUCCESS',
  EXTENSION_DEPRECATE= 'EXTENSION_DEPRECATE',
  EXTENSION_DEPRECATE_ERROR = 'EXTENSION_DEPRECATE_ERROR',
  EXTENSION_DEPRECATE_SUCCESS = 'EXTENSION_DEPRECATE_SUCCESS',
  EXTENSION_UNINSTALL = 'EXTENSION_UNINSTALL',
  EXTENSION_UNINSTALL_ERROR = 'EXTENSION_UNINSTALL_ERROR',
  EXTENSION_UNINSTALL_SUCCESS = 'EXTENSION_UNINSTALL_SUCCESS',
  EXTENSION_UPGRADE = 'EXTENSION_UPGRADE',
  EXTENSION_UPGRADE_ERROR = 'EXTENSION_UPGRADE_ERROR',
  EXTENSION_UPGRADE_SUCCESS = 'EXTENSION_UPGRADE_SUCCESS',
  /*
   * Actions
   */
  ACTION_DOMAIN_CREATE = 'ACTION_DOMAIN_CREATE',
  ACTION_DOMAIN_CREATE_ERROR = 'ACTION_DOMAIN_CREATE_ERROR',
  ACTION_DOMAIN_CREATE_SUCCESS = 'ACTION_DOMAIN_CREATE_SUCCESS',
  ACTION_DOMAIN_EDIT = 'ACTION_DOMAIN_EDIT',
  ACTION_DOMAIN_EDIT_ERROR = 'ACTION_DOMAIN_EDIT_ERROR',
  ACTION_DOMAIN_EDIT_SUCCESS = 'ACTION_DOMAIN_EDIT_SUCCESS',
  ACTION_EXPENDITURE_PAYMENT = 'ACTION_EXPENDITURE_PAYMENT',
  ACTION_EXPENDITURE_PAYMENT_ERROR = 'ACTION_EXPENDITURE_PAYMENT_ERROR',
  ACTION_EXPENDITURE_PAYMENT_SUCCESS = 'ACTION_EXPENDITURE_PAYMENT_SUCCESS',
  ACTION_EDIT_COLONY = 'ACTION_EDIT_COLONY',
  ACTION_EDIT_COLONY_ERROR = 'ACTION_EDIT_COLONY_ERROR',
  ACTION_EDIT_COLONY_SUCCESS = 'ACTION_EDIT_COLONY_SUCCESS',
  ACTION_MINT_TOKENS = 'ACTION_MINT_TOKENS',
  ACTION_MINT_TOKENS_ERROR = 'ACTION_MINT_TOKENS_ERROR',
  ACTION_MINT_TOKENS_SUCCESS = 'ACTION_MINT_TOKENS_SUCCESS',
  ACTION_MOVE_FUNDS = 'ACTION_MOVE_FUNDS',
  ACTION_MOVE_FUNDS_ERROR = 'ACTION_MOVE_FUNDS_ERROR',
  ACTION_MOVE_FUNDS_SUCCESS = 'ACTION_MOVE_FUNDS_SUCCESS',
  ACTION_RECOVERY = 'ACTION_RECOVERY',
  ACTION_RECOVERY_ERROR = 'ACTION_RECOVERY_ERROR',
  ACTION_RECOVERY_SUCCESS = 'ACTION_RECOVERY_SUCCESS',
  ACTION_RECOVERY_SET_SLOT = 'ACTION_RECOVERY_SET_SLOT',
  ACTION_RECOVERY_SET_SLOT_ERROR = 'ACTION_RECOVERY_SET_SLOT_ERROR',
  ACTION_RECOVERY_SET_SLOT_SUCCESS = 'ACTION_RECOVERY_SET_SLOT_SUCCESS',
  ACTION_RECOVERY_APPROVE = 'ACTION_RECOVERY_APPROVE',
  ACTION_RECOVERY_APPROVE_ERROR = 'ACTION_RECOVERY_APPROVE_ERROR',
  ACTION_RECOVERY_APPROVE_SUCCESS = 'ACTION_RECOVERY_APPROVE_SUCCESS',
  ACTION_RECOVERY_EXIT = 'ACTION_RECOVERY_EXIT',
  ACTION_RECOVERY_EXIT_ERROR = 'ACTION_RECOVERY_EXIT_ERROR',
  ACTION_RECOVERY_EXIT_SUCCESS = 'ACTION_RECOVERY_EXIT_SUCCESS',
  ACTION_MANAGE_REPUTATION = 'ACTION_MANAGE_REPUTATION',
  ACTION_MANAGE_REPUTATION_ERROR = 'ACTION_MANAGE_REPUTATION_ERROR',
  ACTION_MANAGE_REPUTATION_SUCCESS = 'ACTION_MANAGE_REPUTATION_SUCCESS',
  ACTION_VERSION_UPGRADE = 'ACTION_VERSION_UPGRADE',
  ACTION_VERSION_UPGRADE_ERROR = 'ACTION_VERSION_UPGRADE_ERROR',
  ACTION_VERSION_UPGRADE_SUCCESS = 'ACTION_VERSION_UPGRADE_SUCCESS',
  ACTION_USER_ROLES_SET = 'ACTION_USER_ROLES_SET',
  ACTION_USER_ROLES_SET_ERROR = 'ACTION_USER_ROLES_SET_ERROR',
  ACTION_USER_ROLES_SET_SUCCESS = 'ACTION_USER_ROLES_SET_SUCCESS',
  ACTION_UNLOCK_TOKEN = 'ACTION_UNLOCK_TOKEN',
  ACTION_UNLOCK_TOKEN_ERROR = 'ACTION_UNLOCK_TOKEN_ERROR',
  ACTION_UNLOCK_TOKEN_SUCCESS = 'ACTION_UNLOCK_TOKEN_SUCCESS',
  VERIFIED_RECIPIENTS_MANAGE = 'VERIFIED_RECIPIENTS_MANAGE',
  VERIFIED_RECIPIENTS_MANAGE_SUCCESS = 'VERIFIED_RECIPIENTS_MANAGE_SUCCESS',
  VERIFIED_RECIPIENTS_MANAGE_ERROR  = 'VERIFIED_RECIPIENTS_MANAGE_ERROR ',
  /*
   * Motions
   */
  MOTION_STAKE = 'MOTION_STAKE',
  MOTION_STAKE_ERROR = 'MOTION_STAKE_ERROR',
  MOTION_STAKE_SUCCESS = 'MOTION_STAKE_SUCCESS',
  MOTION_VOTE = 'MOTION_VOTE',
  MOTION_VOTE_ERROR = 'MOTION_VOTE_ERROR',
  MOTION_VOTE_SUCCESS = 'MOTION_VOTE_SUCCESS',
  MOTION_REVEAL_VOTE = 'MOTION_REVEAL_VOTE',
  MOTION_REVEAL_VOTE_ERROR = 'MOTION_REVEAL_VOTE_ERROR',
  MOTION_REVEAL_VOTE_SUCCESS = 'MOTION_REVEAL_VOTE_SUCCESS',
  MOTION_FINALIZE = 'MOTION_FINALIZE',
  MOTION_FINALIZE_ERROR = 'MOTION_FINALIZE_ERROR',
  MOTION_FINALIZE_SUCCESS = 'MOTION_FINALIZE_SUCCESS',
  MOTION_CLAIM = 'MOTION_CLAIM',
  MOTION_CLAIM_ERROR = 'MOTION_CLAIM_ERROR',
  MOTION_CLAIM_SUCCESS = 'MOTION_CLAIM_SUCCESS',
  MOTION_DOMAIN_CREATE_EDIT = 'MOTION_DOMAIN_CREATE_EDIT',
  MOTION_DOMAIN_CREATE_EDIT_ERROR = 'MOTION_DOMAIN_CREATE_EDIT_ERROR',
  MOTION_DOMAIN_CREATE_EDIT_SUCCESS = 'MOTION_DOMAIN_CREATE_EDIT_SUCCESS',
  MOTION_EDIT_COLONY = 'MOTION_EDIT_COLONY',
  MOTION_EDIT_COLONY_ERROR = 'MOTION_EDIT_COLONY_ERROR',
  MOTION_EDIT_COLONY_SUCCESS = 'MOTION_EDIT_COLONY_SUCCESS',
  MOTION_EXPENDITURE_PAYMENT = 'MOTION_EXPENDITURE_PAYMENT',
  MOTION_EXPENDITURE_PAYMENT_ERROR = 'MOTION_EXPENDITURE_PAYMENT_ERROR',
  MOTION_EXPENDITURE_PAYMENT_SUCCESS = 'MOTION_EXPENDITURE_PAYMENT_SUCCESS',
  MOTION_MOVE_FUNDS = 'MOTION_MOVE_FUNDS',
  MOTION_MOVE_FUNDS_ERROR = 'MOTION_MOVE_FUNDS_ERROR',
  MOTION_MOVE_FUNDS_SUCCESS = 'MOTION_MOVE_FUNDS_SUCCESS',
  MOTION_USER_ROLES_SET = 'MOTION_USER_ROLES_SET',
  MOTION_USER_ROLES_SET_ERROR = 'MOTION_USER_ROLES_SET_ERROR',
  MOTION_USER_ROLES_SET_SUCCESS = 'MOTION_USER_ROLES_SET_SUCCESS',
  ROOT_MOTION = 'ROOT_MOTION',
  ROOT_MOTION_ERROR = 'ROOT_MOTION_ERROR',
  ROOT_MOTION_SUCCESS = 'ROOT_MOTION_SUCCESS',
  MOTION_STATE_UPDATE = 'MOTION_STATE_UPDATE',
  MOTION_STATE_UPDATE_ERROR = 'MOTION_STATE_UPDATE_ERROR',
  MOTION_STATE_UPDATE_SUCCESS = 'MOTION_STATE_UPDATE_SUCCESS',
  MOTION_ESCALATE = 'MOTION_ESCALATE',
  MOTION_ESCALATE_ERROR = 'MOTION_ESCALATE_ERROR',
  MOTION_ESCALATE_SUCCESS = 'MOTION_ESCALATE_SUCCESS',
  MOTION_MANAGE_REPUTATION = 'MOTION_MANAGE_REPUTATION',
  MOTION_MANAGE_REPUTATION_ERROR = 'MOTION_MANAGE_REPUTATION_ERROR',
  MOTION_MANAGE_REPUTATION_SUCCESS = 'MOTION_MANAGE_REPUTATION_SUCCESS',
  /*
   * Whitelist
   */
  WHITELIST_ENABLE = 'WHITELIST_ENABLE',
  WHITELIST_ENABLE_ERROR = 'WHITELIST_ENABLE_ERROR',
  WHITELIST_ENABLE_SUCCESS = 'WHITELIST_ENABLE_SUCCESS',
  WHITELIST_UPDATE = 'WHITELIST_UPDATE',
  WHITELIST_UPDATE_SUCCESS = 'WHITELIST_UPDATE_SUCCESS',
  WHITELIST_UPDATE_ERROR = 'WHITELIST_UPDATE_ERROR',
  WHITELIST_SIGN_AGREEMENT = 'WHITELIST_SIGN_AGREEMENT',
  WHITELIST_SIGN_AGREEMENT_ERROR = 'WHITELIST_SIGN_AGREEMENT_ERROR',
  WHITELIST_SIGN_AGREEMENT_SUCCESS = 'WHITELIST_SIGN_AGREEMENT_SUCCESS',
  /*
   * Coin Machine
   */
  COIN_MACHINE_BUY_TOKENS = 'COIN_MACHINE_BUY_TOKENS',
  COIN_MACHINE_BUY_TOKENS_ERROR = 'COIN_MACHINE_BUY_TOKENS_ERROR',
  COIN_MACHINE_BUY_TOKENS_SUCCESS = 'COIN_MACHINE_BUY_TOKENS_SUCCESS',
  COIN_MACHINE_ENABLE = 'COIN_MACHINE_ENABLE',
  COIN_MACHINE_ENABLE_ERROR = 'COIN_MACHINE_ENABLE_ERROR',
  COIN_MACHINE_ENABLE_SUCCESS = 'COIN_MACHINE_ENABLE_SUCCESS',
  COIN_MACHINE_PERIOD_UPDATE = 'COIN_MACHINE_PERIOD_UPDATE',
  COIN_MACHINE_PERIOD_UPDATE_ERROR = 'COIN_MACHINE_PERIOD_UPDATE_ERROR',
  COIN_MACHINE_PERIOD_UPDATE_SUCCESS = 'COIN_MACHINE_PERIOD_UPDATE_SUCCESS',
  /*
   * Transactions
   */
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
  /*
   * Wallet
   */
  WALLET_CREATE = 'WALLET_CREATE',
  WALLET_CREATE_ERROR = 'WALLET_CREATE_ERROR',
  WALLET_CREATE_SUCCESS = 'WALLET_CREATE_SUCCESS',
  /*
   * User Land (mostly settings related)
   */
  USER_AVATAR_REMOVE = 'USER_AVATAR_REMOVE',
  USER_AVATAR_REMOVE_ERROR = 'USER_AVATAR_REMOVE_ERRROR',
  USER_AVATAR_REMOVE_SUCCESS = 'USER_AVATAR_REMOVE_SUCCESS',
  USER_AVATAR_UPLOAD = 'USER_AVATAR_UPLOAD',
  USER_AVATAR_UPLOAD_ERROR = 'USER_AVATAR_UPLOAD_ERRROR',
  USER_AVATAR_UPLOAD_SUCCESS = 'USER_AVATAR_UPLOAD_SUCCESS',
  USER_CONNECTED = 'USER_CONNECTED',
  USER_CONTEXT_SETUP_SUCCESS = 'USER_CONTEXT_SETUP_SUCCESS',
  USER_DEPOSIT_TOKEN = 'USER_DEPOSIT_TOKEN',
  USER_DEPOSIT_TOKEN_ERROR = 'USER_DEPOSIT_TOKEN_ERROR',
  USER_DEPOSIT_TOKEN_SUCCESS = 'USER_DEPOSIT_TOKEN_SUCCESS',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_ERROR = 'USER_LOGOUT_ERROR',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USER_WITHDRAW_TOKEN = 'USER_WITHDRAW_TOKEN',
  USER_WITHDRAW_TOKEN_ERROR = 'USER_WITHDRAW_TOKEN_ERROR',
  USER_WITHDRAW_TOKEN_SUCCESS = 'USER_WITHDRAW_TOKEN_SUCCESS',
  USERNAME_CREATE = 'USERNAME_CREATE',
  USERNAME_CREATE_ERROR = 'USERNAME_CREATE_ERROR',
  USERNAME_CREATE_SUCCESS = 'USERNAME_CREATE_SUCCESS',
  /*
   * Metacolony vesting and claiming
   */
  META_CLAIM_ALLOCATION = 'META_CLAIM_ALLOCATION',
  META_CLAIM_ALLOCATION_ERROR = 'META_CLAIM_ALLOCATION_ERROR',
  META_CLAIM_ALLOCATION_SUCCESS = 'META_CLAIM_ALLOCATION_SUCCESS',
  META_UNWRAP_TOKEN = 'META_UNWRAP_TOKEN',
  META_UNWRAP_TOKEN_ERROR = 'META_UNWRAP_TOKEN_ERROR',
  META_UNWRAP_TOKEN_SUCCESS = 'META_UNWRAP_TOKEN_SUCCESS',
}

