import React from 'react';
import { defineMessages } from 'react-intl';

import { AwardAndSmiteDialogProps } from '../AwardAndSmiteDialogForm';
import ManageReputationContainer from '../ManageReputationContainer';

const MSG = defineMessages({
  title: {
    id: 'dashboard.SmiteDialog.title',
    defaultMessage: 'Smite',
  },
  team: {
    id: 'dashboard.SmiteDialog.team',
    defaultMessage: 'Team in which Reputation should be deducted',
  },
  recipient: {
    id: 'dashboard.SmiteDialog.recipient',
    defaultMessage: 'Recipient',
  },
  amount: {
    id: 'dashboard.SmiteDialog.amount',
    defaultMessage: 'Amount of reputation points to deduct',
  },
  annotation: {
    id: 'dashboard.SmiteDialog.annotation',
    defaultMessage: "Explain why you're smiting the user (optional)",
  },
  userPickerPlaceholder: {
    id: 'dashboard.SmiteDialog.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: 'dashboard.SmiteDialog.noPermission',
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: 'dashboard.SmiteDialog.maxReputation',
    defaultMessage:
      'max: {userReputationAmount} pts ({userPercentageReputation}%)',
  },
});

const displayName = 'dashboard.SmiteDialog';

const SmiteDialog = (props: AwardAndSmiteDialogProps) => (
  <ManageReputationContainer {...props} isSmitingReputation formMSG={MSG} />
);

SmiteDialog.displayName = displayName;

export default SmiteDialog;
