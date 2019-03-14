/* @flow */

import type { RootStateRecord } from '~immutable';

import { CORE_NAMESPACE as ns, CORE_NETWORK } from '../constants';

export const getNetwork = (state: RootStateRecord) =>
  state.getIn([ns, CORE_NETWORK]);

export const getNetworkVersion = (state: RootStateRecord) =>
  state.getIn([ns, CORE_NETWORK, 'record', 'version']);
