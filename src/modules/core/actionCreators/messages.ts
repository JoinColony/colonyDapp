import { AllActions, ActionTypes } from '~redux/index';

export const messageCancel = (id: string): AllActions => ({
  type: ActionTypes.MESSAGE_CANCEL,
  payload: { id },
});
