import { AllActions, ActionTypes } from '~redux/index';

export const userTokenTransfersFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
});
