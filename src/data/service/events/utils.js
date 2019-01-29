/* @flow */

import nanoid from 'nanoid';
import type { EventPayload } from './types';

const CURRENT_VERSION = process.env.VERSION || 0;

// eslint-disable-next-line import/prefer-default-export
export const decoratePayload = <T: EventPayload>(args: *): T =>
  Object.assign(
    {},
    {
      id: nanoid(),
      timestamp: Date.now(),
      version: CURRENT_VERSION,
    },
    args,
  );
