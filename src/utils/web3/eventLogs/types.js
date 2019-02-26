/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

export type ColonyClientEvent = $Values<
  $PropertyType<ColonyClientType, 'events'>,
>;

export type LogFilterOptions = {|
  blocksBack?: number,
  events?: ColonyClientEvent[],
  from?: string,
  to?: string,
|};
