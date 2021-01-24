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
    ({ tokenAddresses }) => {
      return setUserTokensMutation({
        variables: { input: { tokenAddresses } },
      });
    },
    [setUserTokensMutation],
  );

  return (
    /*
     * @TODO This needs to be checked but most likely it doesn work
     * This is because we changed the logic for the TokenEditDilog which now
     * only supports colonies
     *
     * Most likely we'll have to retrieve the old Token Edit Dialog, just for
     * the user and wire it up for launch
     */
    // @ts-ignore
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokensList={userTokens}
      updateTokens={updateTokens}
    />
  );
};

export default UserTokenEditDialog;
