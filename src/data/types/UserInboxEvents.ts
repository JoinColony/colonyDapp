import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { EventTypes, Versions } from '../constants';
import { EventDefinition } from './events';

export type UserInboxEvents =
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
