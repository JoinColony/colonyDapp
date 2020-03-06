import { PersistentTasks, SubmissionStatus } from '~data/index';

export const numStepsCompleted = (steps: PersistentTasks) =>
  steps.reduce((accum, step) => {
    let newVal = accum;
    if (
      step &&
      step.currentUserSubmission &&
      step.currentUserSubmission.status === SubmissionStatus.Accepted
    ) {
      newVal += 1;
    }
    return newVal;
  }, 0);
