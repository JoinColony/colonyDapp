import {
  ActionType,
  ActionTypes,
  ActionTypeWithPayload,
  ErrorActionType,
} from '~redux/index';
import { NetworkProps } from '~immutable/index';
import { WithKey } from '~types/index';

export type NetworkActionTypes =
  | ActionType<ActionTypes.NETWORK_FETCH>
  | ActionTypeWithPayload<ActionTypes.NETWORK_FETCH_SUCCESS, NetworkProps>
  | ErrorActionType<ActionTypes.NETWORK_FETCH_ERROR, WithKey>;
