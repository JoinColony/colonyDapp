import React from 'react';

import Dialog, { DialogProps } from '~core/Dialog';

const displayName = 'dashboard.CreateEditDomainDialog';

const CreateEditDomainDialog = ({ cancel }: DialogProps) => {
  return <Dialog cancel={cancel}>Create domain</Dialog>;
};

CreateEditDomainDialog.displayName = displayName;

export default CreateEditDomainDialog;
