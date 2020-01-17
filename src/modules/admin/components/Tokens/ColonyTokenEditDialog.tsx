import React, { useCallback } from 'react';

import { Address } from '~types/index';
import { useSetColonyTokensMutation } from '~data/index';

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
  const [setColonyTokensMutation] = useSetColonyTokensMutation();

  const setColonyTokens = useCallback(
    ({ tokens }) => {
      setColonyTokensMutation({
        variables: { input: { colonyAddress, tokenAddresses: tokens } },
      });
    },
    [colonyAddress, setColonyTokensMutation],
  );

  // FIXME Rewrite token edit dialog as discussed (only show colony tokens, add via input field)
  const allTokens = [];

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
