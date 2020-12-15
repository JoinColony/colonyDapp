import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import ExpendituresDialog from '~dashboard/ExpendituresDialog';
import CreatePaymentDialog from '~dashboard/CreatePaymentDialog';
import ManageFundsDialog from '~dashboard/ManageFundsDialog';
import TransferFundsDialog from '~dashboard/TransferFundsDialog';

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
      props: {
        nextStepExpenditure: 'dashboard.ExpendituresDialog',
        nextStepManageFunds: 'dashboard.ManageFundsDialog',
      },
    },
    {
      component: ExpendituresDialog,
      props: {
        nextStep: 'dashboard.CreatePaymentDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
      },
    },
    {
      component: CreatePaymentDialog,
      props: {
        colony,
        prevStep: 'dashboard.ExpendituresDialog',
      },
    },
    {
      component: ManageFundsDialog,
      props: {
        nextStep: 'dashboard.TransferFundsDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
      },
    },
    {
      component: TransferFundsDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colonyAddress: colony.colonyAddress,
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
