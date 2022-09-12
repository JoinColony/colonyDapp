import React, { useMemo } from 'react';

import LockedBatch from '~dashboard/ExpenditurePage/Batch/LockedBatch';
import { LockedExpenditureSettings } from '~dashboard/ExpenditurePage/ExpenditureSettings';
import { LockedPayments } from '~dashboard/ExpenditurePage/Payments';
import LockedSplit from '~dashboard/ExpenditurePage/Split/LockedSplit';
import LockedStaged from '~dashboard/ExpenditurePage/Staged/LockedStaged/LockedStaged';
import { Status } from '~dashboard/ExpenditurePage/Stages/constants';
import LockedStreaming from '~dashboard/ExpenditurePage/Streaming/LockedStreaming';
import LockedStreamingSettings from '~dashboard/ExpenditurePage/Streaming/LockedStreamingSettings';
import { Colony } from '~data/index';

import { ExpenditureTypes, StageObject, ValuesType } from './types';

// Mock variables
const startDate = new Date().toLocaleDateString();
const endDate = 'When cancelled';

const displayName = 'pages.ExpenditurePage.LockedSidebar';

interface Props {
  colony: Colony;
  formValues?: ValuesType;
  editForm: () => void;
  pendingChanges?: Partial<ValuesType>;
  status?: Status;
  isCancelled?: boolean;
  pendingMotion?: boolean;
  activeStageId?: string;
  handleReleaseMilestone: (id: string) => void;
  stages: StageObject[];
}

const LockedSidebar = ({
  colony,
  formValues,
  editForm,
  pendingChanges,
  isCancelled,
  pendingMotion,
  status,
  activeStageId,
  handleReleaseMilestone,
  stages,
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
  const activeStage = stages.find((state) => state.id === activeStageId);

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
            editForm={editForm}
            activeStageId={activeStageId}
            handleReleaseMilestone={handleReleaseMilestone}
          />
        );
      }
      default:
        return null;
    }
  }, [
    activeStage,
    activeStageId,
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
        <LockedStreamingSettings startDate={startDate} endDate={endDate} />
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
