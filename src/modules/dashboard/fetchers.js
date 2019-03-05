/* @flow */

import { singleColonySelector } from './selectors';
import { fetchColony } from './actionCreators';

// eslint-disable-next-line import/prefer-default-export
export const colonyFetcher = {
  select: singleColonySelector,
  fetch: fetchColony,
};
