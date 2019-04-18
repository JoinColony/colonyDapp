/* @flow */

import type { Address } from '~types';
import type { DomainType } from '~immutable';

import type { ActionType, ErrorActionType, UniqueActionType } from '../index';

import { ACTIONS } from '../../index';

export type DomainActionTypes = {|
  DOMAIN_CREATE: UniqueActionType<
    typeof ACTIONS.DOMAIN_CREATE,
    {| colonyAddress: Address, domainName: string, parentDomainId?: number |},
    void,
  >,
  DOMAIN_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_ERROR,
    void,
  >,
  DOMAIN_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.DOMAIN_CREATE_SUCCESS,
    {| colonyAddress: string, domain: DomainType |},
    void,
  >,
  DOMAIN_CREATE_TX: ActionType<typeof ACTIONS.DOMAIN_CREATE_TX>,
  DOMAIN_CREATE_TX_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_TX_ERROR,
    void,
  >,
  DOMAIN_CREATE_TX_SUCCESS: ActionType<typeof ACTIONS.DOMAIN_CREATE_TX_SUCCESS>,
|};
