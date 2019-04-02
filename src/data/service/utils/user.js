/* @flow */

import type { EventStore } from '../../../lib/database/stores';

import { USER_EVENT_TYPES } from '../../constants';
import { getUserTokensReducer } from '../reducers';

const { TOKEN_ADDED, TOKEN_REMOVED } = USER_EVENT_TYPES;

// eslint-disable-next-line import/prefer-default-export
export const getUserTokenAddresses = (metadataStore: EventStore) =>
  metadataStore
    .all()
    .filter(({ type }) => type === TOKEN_ADDED || type === TOKEN_REMOVED)
    .reduce(getUserTokensReducer, []);
