import React, { useMemo } from 'react';
import Batch from '~dashboard/ExpenditurePage/Batch';

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

  const secondFormSection = useMemo(() => {
    switch (expenditure) {
      case ExpenditureTypes.Advanced: {
        return <LockedPayments recipients={recipients} colony={colony} />;
      }
      case ExpenditureTypes.Batch: {
        return <Batch />;
      }
      default:
        return null;
    }
  }, [colony, expenditure, recipients]);

  return (
    <>
      <LockedExpenditureSettings
        {...{ expenditure, filteredDomainId, colony }}
      />
      {secondFormSection}
    </>
  );
};

LockedSidebar.displayName = displayName;

export default LockedSidebar;
