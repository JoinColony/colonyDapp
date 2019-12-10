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
