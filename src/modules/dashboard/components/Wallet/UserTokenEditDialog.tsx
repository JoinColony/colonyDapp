import React, { useCallback } from 'react';

import { Address } from '~types/strings';
import TokenEditDialog from '~core/TokenEditDialog';
import { SpinnerLoader } from '~core/Preloaders';
import { useSetUserTokensMutation, useAllTokensQuery } from '~data/index';

interface Props {
  cancel: () => void;
  close: () => void;
  selectedTokens: Address[];
}

const UserTokenEditDialog = ({ selectedTokens = [], cancel, close }: Props) => {
  const { data: allTokensData } = useAllTokensQuery();
  const [setUserTokensMutation] = useSetUserTokensMutation();

  const setUserTokens = useCallback(
    ({ tokens }) => {
      setUserTokensMutation({
        variables: { input: { tokenAddresses: tokens } },
      });
    },
    [setUserTokensMutation],
  );

  if (!allTokensData) {
    return <SpinnerLoader />;
  }

  const { allTokens } = allTokensData;

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
