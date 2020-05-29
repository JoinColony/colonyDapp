import { SetupRecord } from '~immutable/index';
import { RootStateRecord } from '../../state';
import { CORE_NAMESPACE as ns, CORE_SETUP } from '../constants';

export const setupSelector = (state: RootStateRecord): SetupRecord =>
  state.getIn([ns, CORE_SETUP]);

export const setupSagasLoadedSelector = (state: RootStateRecord): SetupRecord =>
  state.getIn([ns, CORE_SETUP, 'contextSagasLoaded']);
