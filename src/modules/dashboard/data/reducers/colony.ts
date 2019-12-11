import { EventReducer } from '~data/types';
import { EventTypes } from '~data/constants';

export const colonyTasksReducer: EventReducer<{
  [draftId: string]: {
    commentsStoreAddress: string;
    taskStoreAddress: string;
  };
}> = (tasks, event) => {
  switch (event.type) {
    case EventTypes.TASK_STORE_REGISTERED: {
      const { commentsStoreAddress, draftId, taskStoreAddress } = event.payload;
      return {
        ...tasks,
        [draftId]: { commentsStoreAddress, taskStoreAddress },
      };
    }
    case EventTypes.TASK_STORE_UNREGISTERED: {
      const { draftId } = event.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [draftId]: unregisteredTask, ...remainingTasks } = tasks;
      return { ...remainingTasks };
    }
    default:
      return tasks;
  }
};
