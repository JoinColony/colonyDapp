/* @flow */

import type { OpenDialog } from '~core/Dialog/types';

/**
 * Simple wrapper function to orchestrate the chain of dialogs needed for the
 * unclaimed profile flow
 *
 * @method unfinishedProfileOpener
 *
 * @param {Function} openDialogFn The `openDialog` method provided by the withDialog() HoC
 */
const unfinishedProfileOpener = (openDialogFn: OpenDialog) => {
  try {
    return openDialogFn('UnfinishedProfileDialog')
      .afterClosed()
      .then(() =>
        openDialogFn('ClaimProfileDialog')
          .afterClosed()
          .then(() => openDialogFn('ENSNameDialog'))
          .catch(error => {
            throw error;
          }),
      );
  } catch (error) {
    // eslint-disable-next-line no-console
    return console.log(error);
  }
};

export default unfinishedProfileOpener;
