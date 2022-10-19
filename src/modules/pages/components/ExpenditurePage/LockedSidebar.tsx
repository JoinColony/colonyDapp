import React, { useMemo } from 'react';
import LockedBatch from '~dashboard/ExpenditurePage/Batch/LockedBatch';

import { LockedExpenditureSettings } from '~dashboard/ExpenditurePage/ExpenditureSettings';
import { LockedPayments } from '~dashboard/ExpenditurePage/Payments';
import LockedSplit from '~dashboard/ExpenditurePage/Split/LockedSplit';
import LockedStaged from '~dashboard/ExpenditurePage/Staged/LockedStaged/LockedStaged';
import { Status } from '~dashboard/ExpenditurePage/Stages/constants';
import LockedStreaming from '~dashboard/ExpenditurePage/Streaming/LockedStreaming';
import { Colony } from '~data/index';

import { ExpenditureTypes, StageObject, ValuesType } from './types';

const displayName = 'pages.ExpenditurePage.LockedSidebar';

// Mock variables
const startDate = new Date().toLocaleDateString();
const endDate = 'When cancelled';

interface Props {
  colony: Colony;
  formValues?: ValuesType;
  editForm: () => void;
  pendingChanges?: Partial<ValuesType>;
  status?: Status;
  isCancelled?: boolean;
  pendingMotion?: boolean;
  activeStage?: StageObject;
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
  activeStage,
  handleReleaseMilestone,
}: Props) => {
  const {
    expenditure,
    recipients,
    filteredDomainId,
    staged,
    split,
    batch,
    streaming,
  } = formValues || {};

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
            activeStage={activeStage}
          />
        );
      }
      case ExpenditureTypes.Split: {
        return (
          <LockedSplit
            colony={colony}
            split={split}
            editForm={editForm}
            activeStageId={activeStage?.id}
          />
        );
      }
      case ExpenditureTypes.Staged: {
        return (
          <LockedStaged
            colony={colony}
            staged={staged}
            activeStageId={activeStage?.id}
            handleReleaseMilestone={handleReleaseMilestone}
            editForm={editForm}
          />
        );
      }
      case ExpenditureTypes.Batch: {
        return (
          <LockedBatch
            batch={batch}
            editForm={editForm}
            activeStageId={activeStage?.id}
          />
        );
      }
      case ExpenditureTypes.Streaming: {
        return (
          <LockedStreaming
            colony={colony}
            fundingSources={streaming?.fundingSources}
          />
        );
      }
      default:
        return null;
    }
  }, [
    activeStage,
    batch,
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
    streaming,
  ]);

  return (
    <>
      {expenditure === ExpenditureTypes.Streaming ? (
        <LockedStreaming startDate={startDate} endDate={endDate} />
      ) : (
        <LockedExpenditureSettings
          {...{ expenditure, filteredDomainId, colony }}
        />
      )}
      {secondFormSection}
    </>
  );
};

LockedSidebar.displayName = displayName;

export default LockedSidebar;
