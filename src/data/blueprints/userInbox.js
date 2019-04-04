/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types/index';

import { FeedStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';
import inboxMessages from '~users/Inbox/messages';

const userInboxStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  name: 'userInbox',
  /*
   * @TODO Add the relevant props, only as they become necessary, otherwise
   * this will become even more confusing
   */
  schema: yup.object({
    event: yup.string().oneOf(Object.keys(inboxMessages)),
    user: yup.string(),
    task: yup.string(),
    comment: yup.string(),
    colony: yup.string(),
  }),
  type: FeedStore,
};

export default userInboxStore;
