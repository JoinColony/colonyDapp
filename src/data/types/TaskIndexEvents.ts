import { EventDefinition } from './events';
import { EventTypes, Versions } from '../constants';

export type TaskIndexEvents =
  | EventDefinition<
      EventTypes.TASK_STORE_REGISTERED,
      {
        commentsStoreAddress: string;
        draftId: string;
        taskStoreAddress: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_STORE_UNREGISTERED,
      {
        draftId: string;
        taskStoreAddress: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_STORE_REGISTERED,
      {
        commentsStoreAddress: string;
        draftId: string;
        taskStoreAddress: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_STORE_UNREGISTERED,
      {
        draftId: string;
        taskStoreAddress: string;
        domainId: number;
      },
      Versions.CURRENT
    >;
