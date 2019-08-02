/* @flow */

import type { RootStateRecord } from '~immutable';

import { CORE_NAMESPACE as ns, CORE_CONNECTION } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const connection = (state: RootStateRecord) =>
  state.getIn([ns, CORE_CONNECTION]);
