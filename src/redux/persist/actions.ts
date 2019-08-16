import { ActionTypeWithPayload, ActionTypes, AllActions } from '~redux/index';

export const rehydrate = (key: string): AllActions => ({
  type: ActionTypes.REHYDRATE,
  payload: { key },
});

export type PersistActionTypes =
  | ActionTypeWithPayload<ActionTypes.REHYDRATE, { key: string }>
  | ActionTypeWithPayload<ActionTypes.REHYDRATED, { key: string; value: any }>;
