import { Address } from '~types/index';
import { CommentsSubscription } from '~data/index';

export const commentTransformer = (
  rawComments: CommentsSubscription['transactionMessages']['messages'],
  currentUserWalletAddress: Address,
  isAdmin = false,
) => {
  if (isAdmin) {
    return rawComments;
  }
  return rawComments.filter(
    ({ initiatorAddress, context: { deleted, adminDelete, userBanned } }) => {
      if (initiatorAddress === currentUserWalletAddress) {
        return !deleted;
      }
      if (deleted || adminDelete || userBanned) {
        return false;
      }
      return true;
    },
  );
};
