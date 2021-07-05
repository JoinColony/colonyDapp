import { AllActions, ActionTypes } from '~redux/index';

export const messageCancel = (id: string): AllActions => ({
  type: ActionTypes.MESSAGE_CANCEL,
  payload: { id },
});

export const messageSign = (id: string) => ({
  type: ActionTypes.MESSAGE_SIGN,
  payload: { id },
  meta: { id },
});
