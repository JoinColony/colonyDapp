import {
  WalletSpecificType,
  WalletCategoryType,
  WALLET_CATEGORIES,
  WALLET_SPECIFICS,
} from '~immutable/index';

/**
 * Helper for putting specific wallet types into categories
 */
export default function getWalletCategory(
  method: WalletSpecificType,
): WalletCategoryType {
  switch (method) {
    case WALLET_SPECIFICS.TREZOR:
    case WALLET_SPECIFICS.LEDGER:
      return WALLET_CATEGORIES.HARDWARE;
    case WALLET_SPECIFICS.METAMASK:
      return WALLET_CATEGORIES.METAMASK;

    /*
     * Everything else we categorize as a software wallet
     */
    default:
      return WALLET_CATEGORIES.SOFTWARE;
  }
}
