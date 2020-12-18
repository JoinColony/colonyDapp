import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyManageDomainsDialog.title',
    defaultMessage: 'Manage domains',
  },
  creatNewDomain: {
    id: 'dashboard.ColonyManageDomainsDialog.creatNewDomain',
    defaultMessage: 'Create new domain',
  },
  editNemDomain: {
    id: 'dashboard.ColonyManageDomainsDialog.editNemDomain',
    defaultMessage: 'Edit domain',
  },
});

const ColonyManageDomainsDialog = ({ cancel, close }: DialogProps) => {
  const items = [
    {
      title: MSG.creatNewDomain,
      description: MSG.creatNewDomain,
      icon: '',
    },
  ];

  return (
    <IndexModal title={MSG.title} cancel={cancel} close={close} items={items} />
  );
};

export default ColonyManageDomainsDialog;
