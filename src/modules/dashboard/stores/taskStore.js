/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const taskStore: StoreBlueprint = {
  // TODO: implement
  getAccessController() {},
  name: 'task',
  schema: yup.object({
    id: yup.number(),
    title: yup.string().required(),
    creator: yup.string().required(),
    specHash: yup.string(),
    dueDate: yup.date(),
    domainName: yup.string(),
    colonyName: yup.string().required(),
    assignee: yup.object(),
    colonyENSName: yup.string(),
    currentState: yup.string(),
    evaluatorHasRated: yup.boolean(),
    evaluatorPayoutClaimed: yup.boolean(),
    evaluatorRateFail: yup.boolean(),
    feedItems: yup.array(),
    managerHasRated: yup.boolean(),
    managerPayoutClaimed: yup.boolean(),
    managerRateFail: yup.boolean(),
    managerRating: yup.number(),
    payouts: yup.array(),
    reputation: yup.number(),
    workerHasRated: yup.boolean(),
    workerPayoutClaimed: yup.boolean(),
    workerRateFail: yup.boolean(),
    workerRating: yup.number(),
  }),
  type: DocStore,
};

export default taskStore;
