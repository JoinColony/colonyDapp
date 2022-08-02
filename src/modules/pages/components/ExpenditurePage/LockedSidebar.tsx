import React, { useMemo } from 'react';

import { LockedExpenditureSettings } from '~dashboard/ExpenditurePage/ExpenditureSettings';
import { LockedPayments } from '~dashboard/ExpenditurePage/Payments';
import LockedStaged from '~dashboard/ExpenditurePage/Staged/LockedStaged/LockedStaged';
import { Colony } from '~data/index';

import { ValuesType } from './ExpenditurePage';
import { ExpenditureTypes } from './types';

const displayName = 'pages.ExpenditurePage.LockedSidebar';

interface Props {
  colony: Colony;
  formValues?: ValuesType;
}

const LockedSidebar = ({ colony, formValues }: Props) => {
  const { expenditure, recipients, filteredDomainId, staged } =
    formValues || {};

  const secondFormSection = useMemo(() => {
    switch (expenditure) {
      case ExpenditureTypes.Advanced: {
        return <LockedPayments recipients={recipients} colony={colony} />;
      }
      case ExpenditureTypes.Staged: {
        return <LockedStaged colony={colony} staged={staged} />;
      }
      default:
        return null;
    }
  }, [colony, expenditure, recipients, staged]);

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
