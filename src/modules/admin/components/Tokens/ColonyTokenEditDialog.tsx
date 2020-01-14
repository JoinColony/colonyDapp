import React, { useCallback } from 'react';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { useSetColonyTokensMutation, useColonyTokensQuery } from '~data/index';

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
  const { data } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const [setColonyTokensMutation] = useSetColonyTokensMutation();

  const setColonyTokens = useCallback(
    ({ tokens }) => {
      setColonyTokensMutation({
        variables: { input: { colonyAddress, tokenAddresses: tokens } },
      });
    },
    [colonyAddress, setColonyTokensMutation],
  );

  if (!data) {
    return <SpinnerLoader />;
  }

  const {
    colony: { tokens },
  } = data;

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      availableTokens={tokens}
      nativeTokenAddress={nativeTokenAddress}
      selectedTokens={selectedTokens}
      onSubmit={setColonyTokens}
    />
  );
};

export default ColonyTokenEditDialog;
