import { AnyTask } from '~data/index';
import { EventDefinition } from './events';
import { EventTypes, Versions } from '../constants';

export type TaskIndexEvents =
  | EventDefinition<
      EventTypes.TASK_STORE_REGISTERED,
      {
        commentsStoreAddress: string;
        draftId: AnyTask['id'];
        taskStoreAddress: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_STORE_UNREGISTERED,
      {
        draftId: AnyTask['id'];
        taskStoreAddress: string;
      },
      Versions.V1
    >
  | EventDefinition<
      EventTypes.TASK_STORE_REGISTERED,
      {
        commentsStoreAddress: string;
        draftId: AnyTask['id'];
        taskStoreAddress: string;
        domainId: number;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_STORE_UNREGISTERED,
      {
        draftId: AnyTask['id'];
        taskStoreAddress: string;
        domainId: number;
      },
      Versions.CURRENT
    >;
