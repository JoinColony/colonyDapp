import { ConnectionRecord } from '~immutable/Connection';
import { RootStateRecord } from '../../state';
import { CORE_NAMESPACE as ns, CORE_CONNECTION } from '../constants';

export const connection = (state: RootStateRecord): ConnectionRecord =>
  state.getIn([ns, CORE_CONNECTION]);
