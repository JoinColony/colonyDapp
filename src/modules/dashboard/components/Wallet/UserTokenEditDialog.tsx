import React, { useCallback } from 'react';

import { Address } from '~types/strings';
import TokenEditDialog from '~core/TokenEditDialog';
import {
  useSetUserTokensMutation,
  UserTokensDocument,
  UserTokensQueryVariables,
} from '~data/index';

interface Props {
  cancel: () => void;
  close: () => void;
  selectedTokens: Address[];
  walletAddress: Address;
}

const UserTokenEditDialog = ({
  selectedTokens = [],
  cancel,
  close,
  walletAddress,
}: Props) => {
  const [setUserTokensMutation] = useSetUserTokensMutation({
    refetchQueries: [
      {
        query: UserTokensDocument,
        variables: { address: walletAddress } as UserTokensQueryVariables,
      },
    ],
  });

  const setUserTokens = useCallback(
    ({ tokens }) => {
      setUserTokensMutation({
        variables: { input: { tokenAddresses: tokens } },
      });
    },
    [setUserTokensMutation],
  );

  // FIXME refactor this component to just take a token address
  const allTokens = [];

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      availableTokens={allTokens}
      selectedTokens={selectedTokens}
      onSubmit={setUserTokens}
    />
  );
};

export default UserTokenEditDialog;
