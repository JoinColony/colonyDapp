import { RootStateRecord } from '~immutable/index';

import { CORE_NAMESPACE as ns, CORE_CONNECTION } from '../constants';

export const connection = (state: RootStateRecord) =>
  state.getIn([ns, CORE_CONNECTION]);
