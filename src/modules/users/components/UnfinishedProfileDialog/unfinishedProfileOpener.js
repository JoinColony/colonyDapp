/* @flow */

import type { OpenDialog } from '~core/Dialog/types';

import BigNumber from 'bn.js';

import { log } from '~utils/debug';

/**
 * Simple wrapper function to orchestrate the chain of dialogs needed for the
 * unclaimed profile flow
 *
 * @method unfinishedProfileOpener
 *
 * @param {Function} openDialogFn The `openDialog` method provided by the withDialog() HoC
 * @param {string} balance The current user's wallet balance
 */
const unfinishedProfileOpener = (
  openDialogFn: OpenDialog,
  balance: string = '0',
) => {
  const bigNumberBalance = new BigNumber(balance);
  /*
   * Step 1, Entry dialog with claim profile information
   */
  const unfishedProfileDialog = () => openDialogFn('UnfinishedProfileDialog');
  /*
   * Step 3, Claim Username dialog
   */
  const claimUsernameDialog = () => openDialogFn('ENSNameDialog');
  /*
   * Step 2, Fund your wallet dialog
   */
  const fundWalletDialog = () =>
    openDialogFn('ClaimProfileDialog')
      .afterClosed()
      .then(claimUsernameDialog);
  try {
    const unfinishedProfileClosed = unfishedProfileDialog().afterClosed();
    /*
     * If we have some ETH in the wallet, skip the funding step
     */
    return unfinishedProfileClosed.then(
      bigNumberBalance.gt(new BigNumber('0'))
        ? claimUsernameDialog
        : fundWalletDialog,
    );
  } catch (caughtError) {
    log(caughtError);
  }
  return null;
};

export default unfinishedProfileOpener;
