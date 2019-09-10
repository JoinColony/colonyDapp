import { EventTypes, Versions } from '~data/constants';
import { EventDefinition } from '~data/types/events';
import { Address } from '~types/strings';

export type CommentEvents = EventDefinition<
  EventTypes.COMMENT_POSTED,
  {
    signature: string;
    content: {
      id: string;
      author: Address;
      body: string;
    };
  },
  Versions.CURRENT
>;
