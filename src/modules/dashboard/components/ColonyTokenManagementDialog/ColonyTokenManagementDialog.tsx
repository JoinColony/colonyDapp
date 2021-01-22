import React, { useCallback } from 'react';

import TokenEditDialog from '~core/TokenEditDialog';
import { Colony } from '~data/index';
import { Address } from '~types/index';
import getTokenList from './getTokenList';

interface Props {
  colony: Colony;
  cancel: () => void;
  close: () => void;
}

const displayName = 'dashboard.ColonyTokenManagementDialog';

const ColonyTokenManagementDialog = ({
  colony: { tokens = [] },
  colony,
  cancel,
  close,
}: Props) => {
  /*
   * @TODO This will be refactored to send the updated addresss to IPFS
   */
  const updateTokens = useCallback(
    (updatedAddresses: Address[]) => Promise.resolve(updatedAddresses),
    [],
  );

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      tokens={tokens}
      updateTokens={updateTokens}
      tokensList={getTokenList}
      nativeTokenAddress={colony.nativeTokenAddress}
    />
  );
};

ColonyTokenManagementDialog.displayName = displayName;

export default ColonyTokenManagementDialog;
