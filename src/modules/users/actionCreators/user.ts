import { AllActions, ActionTypes } from '~redux/index';

export const userTokensFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKENS_FETCH,
});

export const userTokenTransfersFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
});

export const inboxItemsFetch = (): AllActions => ({
  type: ActionTypes.INBOX_ITEMS_FETCH,
});
