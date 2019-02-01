/* @flow */

import nanoid from 'nanoid';
import type { EventPayload } from './types';

const VERSION = Number(process.env.VERSION) || 0;

// eslint-disable-next-line import/prefer-default-export
export const decoratePayload = <T: EventPayload>(args: *): T =>
  Object.assign(
    {},
    {
      id: nanoid(),
      timestamp: Date.now(),
      version: VERSION,
    },
    args,
  );
