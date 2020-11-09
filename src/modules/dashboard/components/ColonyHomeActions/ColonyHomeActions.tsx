import React from 'react';
import Button from '~core/Button';
import ColonyActionsDialog from './ColonyActionsDialog';
import { useDialog } from '~core/Dialog';

const displayName = 'dashboard.ColonyHomeActions';

const ColonyHomeActions = () => {
  const openDialog = useDialog(ColonyActionsDialog);

  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={{ id: 'button.action' }}
      onClick={() => openDialog()}
    />
  );
};

ColonyHomeActions.displayName = displayName;

export default ColonyHomeActions;
