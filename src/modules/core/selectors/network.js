/* @flow */

import type { RootStateRecord } from '~immutable';

import { CORE_NAMESPACE as ns, CORE_NETWORK } from '../constants';

/*
 * Input selectors
 */
export const networkSelector = (state: RootStateRecord) =>
  state.getIn([ns, CORE_NETWORK]);

export const networkVersionSelector = (state: RootStateRecord) =>
  state.getIn([ns, CORE_NETWORK, 'record', 'version']);
