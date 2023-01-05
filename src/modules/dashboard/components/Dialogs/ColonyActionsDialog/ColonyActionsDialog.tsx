import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType } from '~utils/hooks';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyActionsDialog.title',
    defaultMessage: 'What would you like to do?',
  },
  createExpenditure: {
    id: 'dashboard.ColonyActionsDialog.createExpenditure',
    defaultMessage: 'Create Expenditure',
  },
  createExpenditureDesc: {
    id: 'dashboard.ColonyActionsDialog.createExpenditureDesc',
    defaultMessage: 'Send funds from this colony to external addresses.',
  },
  manageFunds: {
    id: 'dashboard.ColonyActionsDialog.manageFunds',
    defaultMessage: 'Manage Funds',
  },
  manageFundsDesc: {
    id: 'dashboard.ColonyActionsDialog.manageFundsDesc',
    defaultMessage: 'The tools you need to manage your colony’s money.',
  },
  manageDomains: {
    id: 'dashboard.ColonyActionsDialog.manageDomains',
    defaultMessage: 'Manage Teams',
  },
  manageDomainsDesc: {
    id: 'dashboard.ColonyActionsDialog.manageDomainsDesc',
    defaultMessage: 'Need more structure? Need to change a team name?',
  },
  manageReputation: {
    id: 'dashboard.ColonyActionsDialog.manageReputation',
    defaultMessage: 'Manage Reputation',
  },
  manageReputationDesc: {
    id: 'dashboard.ColonyActionsDialog.manageReputationDesc',
    defaultMessage: 'Award the worthy; Smite the unworthy.',
  },
  advanced: {
    id: 'dashboard.ColonyActionsDialog.advanced',
    defaultMessage: 'Advanced',
  },
  advancedDesc: {
    id: 'dashboard.ColonyActionsDialog.advancedDesc',
    defaultMessage:
      'Need to tinker under the hood? This is the place to do it.',
  },
  DAOIncorporationTitle: {
    id: 'dashboard.ColonyActionsDialog.DAOIncorporationTitle',
    defaultMessage: 'DAO Incorporation',
  },
  DAOIncorporationDesc: {
    id: 'dashboard.ColonyActionsDialog.DAOIncorporationDesc',
    defaultMessage: `Setup a legal entity to extend functionality and protect contributors.`,
  },
});

interface CustomWizardDialogProps {
  nextStepExpenditure: string;
  nextStepManageFunds: string;
  nextStepManageDomains: string;
  nextStepAdvanced: string;
  nextStepManageReputation: string;
  nextStepDAOInterporation: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ColonyActionsDialog';

const ColonyActionsDialog = ({
  cancel,
  close,
  callStep,
  nextStepExpenditure,
  nextStepManageFunds,
  nextStepManageDomains,
  nextStepAdvanced,
  nextStepManageReputation,
  nextStepDAOInterporation,
}: Props) => {
  const items = [
    {
      title: MSG.createExpenditure,
      description: MSG.createExpenditureDesc,
      icon: 'emoji-bag-money-sign',
      onClick: () => callStep(nextStepExpenditure),
      dataTest: 'expenditureDialogIndexItem',
    },
    {
      title: MSG.manageFunds,
      description: MSG.manageFundsDesc,
      icon: 'emoji-money-wings',
      onClick: () => callStep(nextStepManageFunds),
      dataTest: 'fundsDialogIndexItem',
    },
    {
      title: MSG.manageDomains,
      description: MSG.manageDomainsDesc,
      icon: 'emoji-crane',
      onClick: () => callStep(nextStepManageDomains),
      dataTest: 'domainsDialogIndexItem',
    },
    {
      title: MSG.manageReputation,
      description: MSG.manageReputationDesc,
      icon: 'emoji-firebolt',
      onClick: () => callStep(nextStepManageReputation),
      dataTest: 'reputationDialogIndexItem',
    },
    {
      title: MSG.advanced,
      description: MSG.advancedDesc,
      icon: 'emoji-smiley-nerd',
      onClick: () => callStep(nextStepAdvanced),
      dataTest: 'advancedDialogIndexItem',
    },
    {
      title: MSG.DAOIncorporationTitle,
      description: MSG.DAOIncorporationDesc,
      icon: 'flag',
      onClick: () => callStep(nextStepDAOInterporation),
      dataTest: 'nextStepDAOInterporation',
    },
  ];
  return (
    <IndexModal cancel={cancel} close={close} title={MSG.title} items={items} />
  );
};

ColonyActionsDialog.displayName = displayName;

export default ColonyActionsDialog;
