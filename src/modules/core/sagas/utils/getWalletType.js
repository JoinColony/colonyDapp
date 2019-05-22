/* @flow */

/*
 * Helper for general categorization of wallets:
 * - Software
 * - Hardware
 * - Metamask
 */
export default function getWalletType(
  method: string,
): 'software' | 'metamask' | 'hardware' {
  switch (method) {
    case 'trezor':
    case 'ledger':
      return 'hardware';
    case 'metamask':
      return 'metamask';
    /*
     * Everything else we categorize as a software wallet
     */
    default:
      return 'software';
  }
}
