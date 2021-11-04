import React from 'react';
import { defineMessages } from 'react-intl';

import { AwardAndSmiteDialogProps } from '../types';
import ManageReputationContainer from '../ManageReputationContainer';

const displayName = 'dashboard.AwardDialog';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AwardDialog.title',
    defaultMessage: 'Award',
  },
  team: {
    id: 'dashboard.AwardDialog.team',
    defaultMessage: 'Team in which Reputation should be awarded',
  },
  recipient: {
    id: 'dashboard.AwardDialog.recipient',
    defaultMessage: 'Recipient',
  },
  amount: {
    id: 'dashboard.AwardDialog.amount',
    defaultMessage: 'Amount of reputation points to award',
  },
  annotation: {
    id: 'dashboard.AwardDialog.annotation',
    defaultMessage: "Explain why you're awarding the user (optional)",
  },
  userPickerPlaceholder: {
    id: 'dashboard.AwardDialog.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: 'dashboard.AwardDialog.noPermission',
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: 'dashboard.AwardDialog.maxReputation',
    defaultMessage: '{userReputationAmount} pts ({userPercentageReputation}%)',
  },
});

const AwardDialog = (props: AwardAndSmiteDialogProps) => (
  <ManageReputationContainer {...props} formMSG={MSG} />
);

AwardDialog.displayName = displayName;

export default AwardDialog;
