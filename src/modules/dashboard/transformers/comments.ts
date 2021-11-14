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
    ({ initiatorAddress, context: { deleted, adminDelete } }) => {
      if (initiatorAddress === currentUserWalletAddress) {
        return !deleted;
      }
      if (deleted || adminDelete) {
        return false;
      }
      return true;
    },
  );
};
