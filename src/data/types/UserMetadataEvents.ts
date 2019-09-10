import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { EventTypes, Versions } from '../constants';
import { EventDefinition } from './events';

export type UserMetadataEvents =
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
    >;
