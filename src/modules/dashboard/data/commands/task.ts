import { Context } from '~context/index';
import { EventTypes } from '~data/constants';
import {
  ColonyManager,
  Command,
  CommentsStore,
  DDB,
  Event,
} from '~data/types';
import {
  getCommentsStore,
  getCommentsStoreAddress,
} from '~data/stores';
import { createEvent } from '~data/utils';
import { Address } from '~types/index';

import {
  PostCommentCommandArgsSchema,
} from './schemas';

/*
 * @todo Better wording for metadata and context
 * @body There's a confusion around query metadata, store metadata, this is a mess!
 */
interface TaskStoreMetadata {
  colonyAddress: Address;
  draftId: string;
}

type CommentsStoreMetadata = TaskStoreMetadata;

const prepareCommentsStoreCommand = async (
  {
    ddb,
  }: {
    ddb: DDB;
  },
  metadata: CommentsStoreMetadata,
) => {
  const commentsStoreAddress = await getCommentsStoreAddress(ddb)(metadata);
  return getCommentsStore(ddb)({ ...metadata, commentsStoreAddress });
};

export const postComment: Command<
  CommentsStore,
  CommentsStoreMetadata,
  {
    signature: string;
    content: {
      id: string;

      /*
       * The author's address is passed explicitly in the arguments (as opposed
       * to using `event.meta.userAddress`) because it gets signed alongside
       * all of the other comment data (since it is a permissive store).
       */
      author: Address;
      body: string;
    };
  },
  {
    event: Event<EventTypes.COMMENT_POSTED>;
    commentsStore: CommentsStore;
  }
> = {
  name: 'postComment',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareCommentsStoreCommand,
  schema: PostCommentCommandArgsSchema,
  async execute(commentsStore, args) {
    const eventHash = await commentsStore.append(
      createEvent(EventTypes.COMMENT_POSTED, args),
    );
    return {
      commentsStore,
      event: commentsStore.getEvent(eventHash) as Event<
        EventTypes.COMMENT_POSTED
      >,
    };
  },
};
