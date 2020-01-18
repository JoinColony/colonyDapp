import React, { useCallback } from 'react';

import { Address } from '~types/strings';
import TokenEditDialog from '~core/TokenEditDialog';
import {
  useSetUserTokensMutation,
  UserTokensDocument,
  UserTokensQueryVariables,
  useUserTokensQuery,
} from '~data/index';

interface Props {
  cancel: () => void;
  close: () => void;
  walletAddress: Address;
}

const UserTokenEditDialog = ({ cancel, close, walletAddress }: Props) => {
  const [setUserTokensMutation] = useSetUserTokensMutation({
    refetchQueries: [
      {
        query: UserTokensDocument,
        variables: { address: walletAddress } as UserTokensQueryVariables,
      },
    ],
  });

  const { data } = useUserTokensQuery({
    variables: { address: walletAddress },
  });

  const userTokens = (data && data.user.tokens) || [];

  const addToken = useCallback(
    (newTokenAddress: Address) => {
      const newAddresses = [
        ...userTokens.map(({ address }) => address),
        newTokenAddress,
      ];
      return setUserTokensMutation({
        variables: { input: { tokenAddresses: newAddresses } },
      });
    },
    [setUserTokensMutation, userTokens],
  );

  const removeToken = useCallback(
    (tokenAddressToRemove: Address) => {
      const newAddresses = userTokens
        .filter(({ address }) => address !== tokenAddressToRemove)
        .map(({ address }) => address);
      return setUserTokensMutation({
        variables: { input: { tokenAddresses: newAddresses } },
      });
    },
    [setUserTokensMutation, userTokens],
  );

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokens={userTokens}
      addTokenFn={addToken}
      removeTokenFn={removeToken}
    />
  );
};

export default UserTokenEditDialog;
