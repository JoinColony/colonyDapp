import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { EventTypes, Versions } from '../constants';
import { EventDefinition } from './events';

// @todo Split UserEvents into metadata and inbox events
export type UserEvents =
  | EventDefinition<
      EventTypes.READ_UNTIL,
      {
        readUntil: number;
        exceptFor: string[];
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.SUBSCRIBED_TO_COLONY,
      { colonyAddress: Address },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.UNSUBSCRIBED_FROM_COLONY,
      { colonyAddress: Address },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.SUBSCRIBED_TO_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.UNSUBSCRIBED_FROM_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TOKEN_ADDED,
      {
        address: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TOKEN_REMOVED,
      {
        address: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.COMMENT_MENTION,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        comment: string;
        sourceUserAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.ASSIGNED_TO_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.UNASSIGNED_FROM_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.WORK_REQUEST,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_FINALIZED_NOTIFICATION,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      },
      Versions.CURRENT
    >;
