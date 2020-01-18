import React, { useCallback } from 'react';

import { Address } from '~types/index';
import { useSetColonyTokensMutation, useColonyTokensQuery } from '~data/index';

import TokenEditDialog from '~core/TokenEditDialog';

interface Props {
  colonyAddress: Address;
  cancel: () => void;
  close: () => void;
  nativeTokenAddress: Address;
}

const ColonyTokenEditDialog = ({
  colonyAddress,
  nativeTokenAddress,
  cancel,
  close,
}: Props) => {
  const [setColonyTokensMutation] = useSetColonyTokensMutation();

  const { data } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const colonyTokens = (data && data.colony.tokens) || [];

  const addToken = useCallback(
    (newTokenAddress: Address) => {
      const newAddresses = [
        ...colonyTokens.map(({ address }) => address),
        newTokenAddress,
      ];
      return setColonyTokensMutation({
        variables: { input: { colonyAddress, tokenAddresses: newAddresses } },
      });
    },
    [colonyAddress, colonyTokens, setColonyTokensMutation],
  );

  const removeToken = useCallback(
    (tokenAddressToRemove: Address) => {
      const newAddresses = colonyTokens
        .filter(({ address }) => address !== tokenAddressToRemove)
        .map(({ address }) => address);
      return setColonyTokensMutation({
        variables: { input: { colonyAddress, tokenAddresses: newAddresses } },
      });
    },
    [colonyAddress, colonyTokens, setColonyTokensMutation],
  );

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokens={colonyTokens}
      nativeTokenAddress={nativeTokenAddress}
      addTokenFn={addToken}
      removeTokenFn={removeToken}
    />
  );
};

export default ColonyTokenEditDialog;
