import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps } from '~core/Dialog';
import Heading from '~core/Heading';
import ColonyActionsItem from './ColonyActionsItem';
import styles from './ColonyActionsDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.title',
    defaultMessage: 'What would you like to do?',
  },
  createExpenditure: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.createExpenditure',
    defaultMessage: 'Create Expenditure',
  },
  createExpenditureDesc: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.createExpenditureDesc',
    defaultMessage: 'Send funds from this colony to external addresses.',
  },
  manageFunds: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.manageFunds',
    defaultMessage: 'Manage Funds',
  },
  manageFundsDesc: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.manageFundsDesc',
    defaultMessage: 'The tools you need to manage your colony’s money.',
  },
  manageDomains: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.manageDomains',
    defaultMessage: 'Manage Domains',
  },
  manageDomainsDesc: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.manageDomainsDesc',
    defaultMessage: 'Need more structure? Need to change a domain name?',
  },
  smite: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.smite',
    defaultMessage: 'Smite',
  },
  smiteDesc: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.smiteDesc',
    defaultMessage: 'Punish bad behaviour by penalising Reputation.',
  },
  advanced: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.advanced',
    defaultMessage: 'Advanced',
  },
  advancedDesc: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsDialog.advancedDesc',
    defaultMessage: 'Need to tinker under the hood? This is the place to do it.',
  }
});

const ColonyActionsDialog = ({
  cancel,
}: DialogProps) => {

  return (
    <Dialog cancel={cancel}>
      <div className={styles.header}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', weight: 'bold', theme: 'grey' }}
          text={MSG.title}
        />
      </div>
      <div className={styles.content}>
        <ColonyActionsItem title={MSG.createExpenditure} description={MSG.createExpenditureDesc} />
        <ColonyActionsItem title={MSG.manageFunds} description={MSG.manageFundsDesc} />
        <ColonyActionsItem title={MSG.manageDomains} description={MSG.manageDomainsDesc} />
        <ColonyActionsItem title={MSG.smite} description={MSG.smiteDesc} disabled/>
        <ColonyActionsItem title={MSG.advanced} description={MSG.advancedDesc} />
      </div>
    </Dialog>
  );
};

export default ColonyActionsDialog;
