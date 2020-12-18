import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ManageDomainsDialog.title',
    defaultMessage: 'Manage domains',
  },
  creatNewDomain: {
    id: 'dashboard.ManageDomainsDialog.creatNewDomain',
    defaultMessage: 'Create new domain',
  },
  editDomain: {
    id: 'dashboard.ManageDomainsDialog.editDomain',
    defaultMessage: 'Edit domain',
  },
});

const displayName = 'dashboard.ManageDomainsDialog';

const ManageDomainsDialog = ({ cancel, close }: DialogProps) => {
  const items = [
    {
      title: MSG.creatNewDomain,
      description: MSG.creatNewDomain,
      icon: 'emoji-crane',
    },
    {
      title: MSG.editDomain,
      description: MSG.editDomain,
      icon: 'pencil-note',
    },
  ];

  return (
    <IndexModal title={MSG.title} cancel={cancel} close={close} items={items} />
  );
};

ManageDomainsDialog.displayName = displayName;

export default ManageDomainsDialog;
