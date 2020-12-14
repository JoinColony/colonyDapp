import React, { useCallback } from 'react';

import TokenEditDialog from '~core/TokenEditDialog';
import {
  useSetColonyTokensMutation,
  useColonyTokensQuery,
  ColonyTokensDocument,
  ColonyTokensQueryVariables,
} from '~data/index';
import { Address } from '~types/index';
import tokensList from './tokenlist.json';

interface Props {
  colonyAddress: Address;
  cancel: () => void;
  close: () => void;
}

const displayName = 'dashboard.ColonyTokenManagementDialog';

const ColonyTokenManagementDialog = ({
  colonyAddress,
  cancel,
  close,
}: Props) => {
  const [setColonyTokensMutation] = useSetColonyTokensMutation({
    refetchQueries: [
      {
        query: ColonyTokensDocument,
        variables: { address: colonyAddress } as ColonyTokensQueryVariables,
      },
    ],
  });

  const { data } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const colonyTokens = (data && data.colony.tokens) || [];

  const updateTokens = useCallback(
    (updatedAddresses: Address[]) => {
      return setColonyTokensMutation({
        variables: {
          input: { colonyAddress, tokenAddresses: updatedAddresses },
        },
      });
    },
    [colonyAddress, setColonyTokensMutation],
  );

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokens={colonyTokens}
      updateTokens={updateTokens}
      tokensList={
        process.env.NODE_ENV === 'development' ? [] : tokensList.tokens
      }
      nativeTokenAddress={data?.colony?.nativeTokenAddress}
    />
  );
};

ColonyTokenManagementDialog.displayName = displayName;

export default ColonyTokenManagementDialog;
