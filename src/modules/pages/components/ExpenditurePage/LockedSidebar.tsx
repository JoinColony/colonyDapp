import React from 'react';

import { LockedExpenditureSettings } from '~dashboard/ExpenditurePage/ExpenditureSettings';
import { LockedPayments } from '~dashboard/ExpenditurePage/Payments';
import { Colony } from '~data/index';

import { ValuesType } from './ExpenditurePage';
import { ExpenditureTypes } from './types';

const displayName = 'pages.ExpenditurePage.LockedSidebar';

interface Props {
  colony: Colony;
  formValues?: ValuesType;
}

const LockedSidebar = ({ colony, formValues }: Props) => {
  const { expenditure, recipients, filteredDomainId } = formValues || {};

  return (
    <>
      <LockedExpenditureSettings
        {...{ expenditure, filteredDomainId, colony }}
      />
      {expenditure === ExpenditureTypes.Advanced && (
        <LockedPayments recipients={recipients} colony={colony} />
      )}
    </>
  );
};

LockedSidebar.displayName = displayName;

export default LockedSidebar;
