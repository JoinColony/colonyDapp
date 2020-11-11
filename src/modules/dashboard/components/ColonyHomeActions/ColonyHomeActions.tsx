import React from 'react';
import Button from '~core/Button';
import { defineMessages } from 'react-intl';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import { useDialog } from '~core/Dialog';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newAction: {
    id: 'dashboard.ColonyHomeActions.newAction',
    defaultMessage: 'New Action',
  },
});

const ColonyHomeActions = () => {
  const openDialog = useDialog(ColonyActionsDialog);

  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={MSG.newAction}
      onClick={() => openDialog()}
    />
  );
};

ColonyHomeActions.displayName = displayName;

export default ColonyHomeActions;
