import {
  ActionTypeWithPayloadAndMeta,
  ActionTypeWithMeta,
  ActionTypes,
} from '~redux/index';
import { TransactionError, TransactionType } from '~immutable/index';
import { TransactionReceipt } from '~types/index';

type WithId = { id: string };

export type TransactionActionTypes =
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ADD_IDENTIFIER,
      { identifier: string },
      WithId
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ADD_PARAMS,
      { params: object },
      WithId
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_READY, WithId>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_CANCEL, WithId>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_CREATED,
      Pick<
        TransactionType,
        | 'context'
        | 'createdAt'
        | 'from'
        | 'group'
        | 'identifier'
        | 'methodContext'
        | 'methodName'
        | 'multisig'
        | 'options'
        | 'params'
        | 'status'
      >,
      WithId
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_ERROR,
      { error: TransactionError },
      { id: string }
    > & {
      error: true;
    }
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_ESTIMATE_GAS, WithId>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      { hash: string; params: object },
      WithId
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_GAS_UPDATE,
      { gasLimit?: string; gasPrice?: string },
      WithId
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_LOAD_RELATED,
      { loading: boolean },
      WithId
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
      { receipt: TransactionReceipt; params: object },
      WithId
    >
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SEND, WithId>
  | ActionTypeWithMeta<ActionTypes.TRANSACTION_SENT, WithId>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TRANSACTION_SUCCEEDED,
      { eventData: object; params: object },
      WithId
    >;
