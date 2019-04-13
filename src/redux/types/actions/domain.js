/* @flow */

import type { Address, WithKeyPathDepth2 } from '~types';
import type { DomainId, DomainType } from '~immutable';

import type {
  ActionType,
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithPayloadAndMeta,
} from '../index';

import { ACTIONS } from '../../index';

export type DomainActionTypes = {|
  DOMAIN_CREATE: UniqueActionType<
    typeof ACTIONS.DOMAIN_CREATE,
    {| colonyAddress: Address, domainName: string, parentDomainId?: number |},
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_ERROR,
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.DOMAIN_CREATE_SUCCESS,
    DomainType,
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_TX: ActionType<typeof ACTIONS.DOMAIN_CREATE_TX>,
  DOMAIN_CREATE_TX_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_TX_ERROR,
    void,
  >,
  DOMAIN_CREATE_TX_SUCCESS: ActionType<typeof ACTIONS.DOMAIN_CREATE_TX_SUCCESS>,
  DOMAIN_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.DOMAIN_FETCH,
    {| colonyAddress: Address, domainId: DomainId |},
    WithKeyPathDepth2,
  >,
  DOMAIN_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_FETCH_ERROR,
    WithKeyPathDepth2,
  >,
  DOMAIN_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.DOMAIN_FETCH_SUCCESS,
    DomainType,
    WithKeyPathDepth2,
  >,
|};
