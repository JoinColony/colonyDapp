import React, { useCallback } from 'react';

import {
  useSetUserTokensMutation,
  UserTokensDocument,
  UserTokensQueryVariables,
  useUserTokensQuery,
} from '~data/index';
import { Address } from '~types/index';

import DialogForm from './UserTokenEditDialogForm';

interface Props {
  cancel: () => void;
  close: () => void;
  walletAddress: Address;
}

const displayName = 'dashboard.Wallet.UserTokenEditDialog';

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
    ({ tokenAddresses }) => {
      return setUserTokensMutation({
        variables: { input: { tokenAddresses } },
      });
    },
    [setUserTokensMutation],
  );

  return (
    <DialogForm
      cancel={cancel}
      close={close}
      tokensList={userTokens}
      updateTokens={updateTokens}
    />
  );
};

UserTokenEditDialog.displayName = displayName;

export default UserTokenEditDialog;
