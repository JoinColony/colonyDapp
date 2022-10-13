export enum Stage {
  Draft = 'Draft',
  Locked = 'Locked',
  Funded = 'Funded',
  Released = 'Released',
  Claimed = 'Claimed',
}

export enum MotionStatus {
  Passed = 'passed',
  Failed = 'failed',
  Pending = 'pending',
}

export enum MotionType {
  Cancel = 'Cancel',
  Edit = 'Edit',
  StartStream = 'Start stream',
}

export enum Status {
  Cancelled = 'cancelled',
  ForceCancelled = 'forceCancelled',
  Edited = 'edited',
  ForceEdited = 'forceEdited',
  StartedStream = 'startedStream',
}

export interface Motion {
  type: MotionType;
  status: MotionStatus;
}

export const useObserver = (
  setFieldErrorsAmount: React.Dispatch<React.SetStateAction<number>>,
) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const nodeListLength = document
          .getElementById('expenditurePage')
          ?.querySelectorAll('[aria-invalid="true"]').length;

        setFieldErrorsAmount(nodeListLength || 0);
      }
    });
  });

  return { observer };
};
