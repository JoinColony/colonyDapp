/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import {
  CORE_NAMESPACE as ns,
  CORE_MESSAGES,
  CORE_MESSAGES_LIST,
} from '../constants';

export const messageById = (state: RootStateRecord, id: string) =>
  state.getIn([ns, CORE_MESSAGES, CORE_MESSAGES_LIST, id]);

export const getAllMessages = (state: RootStateRecord) =>
  state.getIn([ns, CORE_MESSAGES, CORE_MESSAGES_LIST], ImmutableMap());
