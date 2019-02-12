/* @flow */
import type { ActionType, ErrorActionType, WithKeyPathDepth2 } from '~types';

import { ACTIONS } from '../../index';
import type { DomainType } from '~immutable';

export type DomainActionTypes = {|
  DOMAIN_CREATE: ActionType<
    typeof ACTIONS.DOMAIN_CREATE,
    {| domainName: string, parentDomainId?: number |},
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_ERROR,
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_SUCCESS: ActionType<
    typeof ACTIONS.DOMAIN_CREATE_SUCCESS,
    {||},
    WithKeyPathDepth2,
  >,
  DOMAIN_CREATE_TX: ActionType<typeof ACTIONS.DOMAIN_CREATE_TX, {||}, void>,
  DOMAIN_CREATE_TX_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_CREATE_TX_ERROR,
    void,
  >,
  DOMAIN_CREATE_TX_SUCCESS: ActionType<
    typeof ACTIONS.DOMAIN_CREATE_TX_SUCCESS,
    {||},
    void,
  >,
  DOMAIN_FETCH: ActionType<
    typeof ACTIONS.DOMAIN_FETCH,
    void,
    WithKeyPathDepth2,
  >,
  DOMAIN_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.DOMAIN_FETCH_ERROR,
    WithKeyPathDepth2,
  >,
  DOMAIN_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.DOMAIN_FETCH_SUCCESS,
    DomainType,
    WithKeyPathDepth2,
  >,
|};
