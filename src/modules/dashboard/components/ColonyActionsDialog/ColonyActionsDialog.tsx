import React from 'react';
import { defineMessages } from 'react-intl';

import Dialog, { DialogProps } from '~core/Dialog';
import Heading from '~core/Heading';
import ColonyActionsDialogItem from './ColonyActionsDialogItem';
import styles from './ColonyActionsDialog.css';

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
    defaultMessage: 'Manage Domains',
  },
  manageDomainsDesc: {
    id: 'dashboard.ColonyActionsDialog.manageDomainsDesc',
    defaultMessage: 'Need more structure? Need to change a domain name?',
  },
  smite: {
    id: 'dashboard.ColonyActionsDialog.smite',
    defaultMessage: 'Smite',
  },
  smiteDesc: {
    id: 'dashboard.ColonyActionsDialog.smiteDesc',
    defaultMessage: 'Punish bad behaviour by penalising Reputation.',
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
});

const displayName = 'dashboard.ColonyActionsDialog';

const ColonyActionsDialog = ({ cancel }: DialogProps) => {
  return (
    <Dialog cancel={cancel}>
      <div className={styles.header}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'medium',
            weight: 'bold',
            theme: 'dark',
          }}
          text={MSG.title}
        />
      </div>
      <div className={styles.content}>
        <ColonyActionsDialogItem
          title={MSG.createExpenditure}
          description={MSG.createExpenditureDesc}
        />
        <ColonyActionsDialogItem
          title={MSG.manageFunds}
          description={MSG.manageFundsDesc}
        />
        <ColonyActionsDialogItem
          title={MSG.manageDomains}
          description={MSG.manageDomainsDesc}
        />
        <ColonyActionsDialogItem
          title={MSG.smite}
          description={MSG.smiteDesc}
          disabled
        />
        <ColonyActionsDialogItem
          title={MSG.advanced}
          description={MSG.advancedDesc}
        />
      </div>
    </Dialog>
  );
};

ColonyActionsDialog.displayName = displayName;

export default ColonyActionsDialog;
