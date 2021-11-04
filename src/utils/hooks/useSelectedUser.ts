import { useMemo } from 'react';

import { useLoggedInUser } from '~data/index';

export const useSelectedUser = (colonyMembers) => {
  const { walletAddress: loggedInUserWalletAddress } = useLoggedInUser();

  return useMemo(() => {
    if (!colonyMembers) {
      return undefined;
    }

    const [firstSubscriber, secondSubscriber] =
      colonyMembers?.subscribedUsers || [];

    if (!secondSubscriber) {
      return firstSubscriber;
    }

    return firstSubscriber.profile.walletAddress === loggedInUserWalletAddress
      ? secondSubscriber
      : firstSubscriber;
  }, [colonyMembers, loggedInUserWalletAddress]);
};
