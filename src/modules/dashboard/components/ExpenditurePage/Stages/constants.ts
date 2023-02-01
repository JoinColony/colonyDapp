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
  Payment = 'Payment',
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
