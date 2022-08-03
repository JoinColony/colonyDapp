import React from 'react';

import Dialog, { DialogProps } from '~core/Dialog';
import { Colony } from '~data/index';

const displayName = 'dashboard.NewDecisionDialog';

interface Props extends DialogProps {
  colony: Colony;
}

const NewDecisionDialog = ({ cancel }: Props) => {
  return <Dialog cancel={cancel}>NEW DECISION PLACEHOLDER DIALOG</Dialog>;
};

NewDecisionDialog.displayName = displayName;

export default NewDecisionDialog;
