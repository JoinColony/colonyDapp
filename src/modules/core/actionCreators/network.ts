import { AllActions, ActionTypes } from '~redux/index';

export const fetchNetwork = (): AllActions => ({
  type: ActionTypes.NETWORK_FETCH,
});
