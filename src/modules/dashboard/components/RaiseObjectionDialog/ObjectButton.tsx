import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import RaiseObjectionDialog from '~dashboard/RaiseObjectionDialog';

const MSG = defineMessages({
  objectButton: {
    id: 'objectButton',
    defaultMessage: 'Object',
  },
});

const ObjectButton = ({
  colonyAddress,
  tokenDecimals,
}: {
  colonyAddress: string;
  tokenDecimals: number;
}) => {
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

  const handleRaiseObjection = useCallback(
    () => openRaiseObjectionDialog({ colonyAddress, tokenDecimals }),
    [colonyAddress, openRaiseObjectionDialog, tokenDecimals],
  );

  return (
    <Button
      // !!!! to change to pink when staking widget PR is merged
      appearance={{ theme: 'primary' }}
      text={MSG.objectButton}
      onClick={handleRaiseObjection}
    />
  );
};

export default ObjectButton;
