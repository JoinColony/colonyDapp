import React from 'react';

import { AwardAndSmiteDialogProps } from '../types';
import ManageReputationContainer from '../ManageReputationContainer';

const displayName = 'dashboard.AwardDialog';

const AwardDialog = (props: AwardAndSmiteDialogProps) => (
  <ManageReputationContainer {...props} />
);

AwardDialog.displayName = displayName;

export default AwardDialog;
