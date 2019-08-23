import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { EventTypes } from '../constants';
import { EventDefinition } from './events';

// @todo Split UserEvents into metadata and inbox events
export type UserEvents =
  | EventDefinition<
      EventTypes.READ_UNTIL,
      {
        readUntil: number;
        exceptFor: string[];
      }
    >
  | EventDefinition<EventTypes.SUBSCRIBED_TO_COLONY, { colonyAddress: Address }>
  | EventDefinition<
      EventTypes.UNSUBSCRIBED_FROM_COLONY,
      { colonyAddress: Address }
    >
  | EventDefinition<
      EventTypes.SUBSCRIBED_TO_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
      }
    >
  | EventDefinition<
      EventTypes.UNSUBSCRIBED_FROM_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
      }
    >
  | EventDefinition<
      EventTypes.TOKEN_ADDED,
      {
        address: Address;
      }
    >
  | EventDefinition<
      EventTypes.TOKEN_REMOVED,
      {
        address: Address;
      }
    >
  | EventDefinition<
      EventTypes.COMMENT_MENTION,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        comment: string;
        sourceUserAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.ASSIGNED_TO_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.UNASSIGNED_FROM_TASK,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.WORK_REQUEST,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.TASK_FINALIZED_NOTIFICATION,
      {
        colonyAddress: Address;
        draftId: TaskDraftId;
        taskTitle: string;
        sourceUserAddress: Address;
      }
    >;
