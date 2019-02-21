/* @flow */

import type { ActionTypeWithPayload, ActionsType } from '~redux/index';

import { ACTIONS } from '~redux/index';

// eslint-disable-next-line import/prefer-default-export
export const rehydrate = (
  key: string,
): $ElementType<ActionsType, 'REHYDRATE'> => ({
  type: ACTIONS.REHYDRATE,
  payload: { key },
});

export type PersistActionTypes = {|
  REHYDRATE: ActionTypeWithPayload<typeof ACTIONS.REHYDRATE, {| key: string |}>,
  REHYDRATED: ActionTypeWithPayload<
    typeof ACTIONS.REHYDRATED,
    {| key: string, value: any |},
  >,
|};
