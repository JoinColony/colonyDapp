import React, { useCallback } from 'react';

import TokenEditDialog from '~core/TokenEditDialog';
import {
  useSetUserTokensMutation,
  UserTokensDocument,
  UserTokensQueryVariables,
  useUserTokensQuery,
} from '~data/index';
import { Address } from '~types/index';

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

  const updateTokens = useCallback(
    (updatedAddresses: Address[]) => {
      return setUserTokensMutation({
        variables: { input: { tokenAddresses: updatedAddresses } },
      });
    },
    [userTokens, setUserTokensMutation],
  );

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokens={userTokens}
      updateTokens={updateTokens}
    />
  );
};

export default UserTokenEditDialog;
