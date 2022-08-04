import React, { useMemo } from 'react';

import Batch from '~dashboard/ExpenditurePage/Batch';
import { LockedExpenditureSettings } from '~dashboard/ExpenditurePage/ExpenditureSettings';
import { LockedPayments } from '~dashboard/ExpenditurePage/Payments';
import { LockedSplit } from '~dashboard/ExpenditurePage/Split';
import LockedStaged from '~dashboard/ExpenditurePage/Staged/LockedStaged/LockedStaged';
import { Status } from '~dashboard/ExpenditurePage/Stages/constants';
import { Colony } from '~data/index';

import { ExpenditureTypes, ValuesType } from './types';

const displayName = 'pages.ExpenditurePage.LockedSidebar';

interface Props {
  colony: Colony;
  formValues?: ValuesType;
  editForm: () => void;
  pendingChanges?: Partial<ValuesType>;
  status?: Status;
  isCancelled?: boolean;
  pendingMotion?: boolean;
  activeStateId?: string;
  handleReleaseMilestone: (id: string) => void;
}

const LockedSidebar = ({
  colony,
  formValues,
  editForm,
  pendingChanges,
  isCancelled,
  pendingMotion,
  status,
  activeStateId,
  handleReleaseMilestone,
}: Props) => {
  const { expenditure, recipients, filteredDomainId, staged, split } =
    formValues || {};

  const secondFormSection = useMemo(() => {
    switch (expenditure) {
      case ExpenditureTypes.Advanced: {
        return (
          <LockedPayments
            recipients={recipients}
            colony={colony}
            editForm={editForm}
            pendingChanges={pendingChanges}
            status={status}
            isCancelled={isCancelled}
            pendingMotion={pendingMotion}
          />
        );
      }
      case ExpenditureTypes.Split: {
        return <LockedSplit colony={colony} split={split} />;
      }
      case ExpenditureTypes.Staged: {
        return (
          <LockedStaged
            colony={colony}
            staged={staged}
            activeStateId={activeStateId}
            handleReleaseMilestone={handleReleaseMilestone}
          />
        );
      }
      case ExpenditureTypes.Batch: {
        return <Batch />;
      }
      default:
        return null;
    }
  }, [
    activeStateId,
    colony,
    editForm,
    expenditure,
    handleReleaseMilestone,
    isCancelled,
    pendingChanges,
    pendingMotion,
    recipients,
    split,
    staged,
    status,
  ]);

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
