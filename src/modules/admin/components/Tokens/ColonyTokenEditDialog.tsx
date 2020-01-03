import React, { useCallback } from 'react';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { useSetColonyTokensMutation, useAllTokensQuery } from '~data/index';

import TokenEditDialog from '~core/TokenEditDialog';

interface Props {
  colonyAddress: Address;
  cancel: () => void;
  close: () => void;
  nativeTokenAddress: Address;
  selectedTokens: Address[];
}

const ColonyTokenEditDialog = ({
  colonyAddress,
  nativeTokenAddress,
  selectedTokens = [],
  cancel,
  close,
}: Props) => {
  const { data: allTokensData } = useAllTokensQuery();
  const [setColonyTokensMutation] = useSetColonyTokensMutation();

  const setColonyTokens = useCallback(
    ({ tokens }) => {
      setColonyTokensMutation({
        variables: { input: { colonyAddress, tokenAddresses: tokens } },
      });
    },
    [colonyAddress, setColonyTokensMutation],
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
      nativeTokenAddress={nativeTokenAddress}
      selectedTokens={selectedTokens}
      onSubmit={setColonyTokens}
    />
  );
};

export default ColonyTokenEditDialog;
