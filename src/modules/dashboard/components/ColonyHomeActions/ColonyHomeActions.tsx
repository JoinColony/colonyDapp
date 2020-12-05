import React from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import ExpendituresDialog from '~dashboard/ExpendituresDialog';
import { useNaiveBranchingDialogWizard } from '~utils/hooks';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newAction: {
    id: 'dashboard.ColonyHomeActions.newAction',
    defaultMessage: 'New Action',
  },
});

const ColonyHomeActions = () => {
  const startWizardFlow = useNaiveBranchingDialogWizard([
    { component: ColonyActionsDialog },
    { component: ExpendituresDialog },
  ]);

  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={MSG.newAction}
      onClick={() => startWizardFlow('dashboard.ColonyActionsDialog')}
    />
  );
};

ColonyHomeActions.displayName = displayName;

export default ColonyHomeActions;
