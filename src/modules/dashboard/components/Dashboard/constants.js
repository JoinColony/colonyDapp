/* @flow */

// eslint-disable-next-line import/prefer-default-export
export const MY_TASKS_FILTER = Object.freeze({
  ALL: 'ALL',
  CREATED: 'CREATED',
  ASSIGNED: 'ASSIGNED',
  COMPLETED: 'COMPLETED',
});

export type MyTasksFilterOptionType = $Keys<typeof MY_TASKS_FILTER>;
