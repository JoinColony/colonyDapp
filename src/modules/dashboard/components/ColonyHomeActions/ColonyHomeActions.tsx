import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import ExpendituresDialog from '~dashboard/ExpendituresDialog';

import { useNaiveBranchingDialogWizard } from '~utils/hooks';
import { Colony } from '~data/index';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newAction: {
    id: 'dashboard.ColonyHomeActions.newAction',
    defaultMessage: 'New Action',
  },
});

interface Props {
  colony: Colony;
}

const ColonyHomeActions = ({ colony }: Props) => {
  const startWizardFlow = useNaiveBranchingDialogWizard([
    {
      component: ColonyActionsDialog,
      props: { nextStepExpenditure: 'dashboard.ExpendituresDialog' },
    },
    {
      component: ExpendituresDialog,
      props: {
        /*
         * @TODO Next step dialog doesn't exist yet, it will be added in #2309
         */
        nextStep: 'dashboard.CreatePaymentDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
      },
    },
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
