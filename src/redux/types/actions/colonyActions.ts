import { BigNumber } from 'ethers/utils';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
  ActionType,
} from './index';

/*
 * @NOTE About naming
 * I couldn't come up with anything better, as we already have ColonyActionTypes :(
 */
export type ColonyActionsActionTypes =
  | ActionType<typeof ActionTypes.COLONY_ACTION_GENERIC>
  | ActionType<typeof ActionTypes.COLONY_ACTION_GENERIC_SUCCESS>
  | ErrorActionType<typeof ActionTypes.COLONY_ACTION_GENERIC_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT,
      {
        colonyAddress: Address;
        colonyName?: string;
        recipientAddress: Address;
        domainId: number;
        singlePayment: {
          amount: BigNumber;
          tokenAddress: Address;
          decimals: number;
        };
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_ACTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        colonyName?: string;
        tokenAddress: Address;
        fromDomainId: number;
        toDomainId: number;
        amount: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_ACTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_ACTION_MOVE_FUNDS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_ACTION_MINT_TOKENS,
      {
        colonyAddress: Address;
        colonyName?: string;
        who: Address;
        amount: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_ACTION_MINT_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_ACTION_MINT_TOKENS_SUCCESS,
      MetaWithHistory<object>
    >;
