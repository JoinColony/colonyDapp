/* @flow */

import { createEventCreator } from '~data/utils';
import { COLONY_EVENT_TYPES } from '~data/constants';

const { COLONY_CREATED } = COLONY_EVENT_TYPES;

// eslint-disable-next-line import/prefer-default-export
export const createColonyCreatedEvent = createEventCreator<
  typeof COLONY_CREATED,
>(COLONY_CREATED);
