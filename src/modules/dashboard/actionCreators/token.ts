import nanoid from 'nanoid';

import { Address } from '~types/index';
import { Action, ActionTypes } from '~redux/index';

export const fetchToken = (
  tokenAddress: Address,
): Action<ActionTypes.TOKEN_INFO_FETCH> => ({
  type: ActionTypes.TOKEN_INFO_FETCH,
  payload: { tokenAddress },
  meta: { id: nanoid(), key: tokenAddress },
});
