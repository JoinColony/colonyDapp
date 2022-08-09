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
  Cancel = 'cancel',
}

export enum Status {
  Cancelled = 'cancelled',
  ForceCancelled = 'forceCancelled',
}

export interface Motion {
  type: MotionType;
  status: MotionStatus;
}
