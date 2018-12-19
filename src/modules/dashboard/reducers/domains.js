/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { Domain, Domains, Draft, Task } from '~immutable';

import type { Action } from '~types';

import {
  DOMAIN_FETCH_SUCCESS,
  DRAFT_CREATE_SUCCESS,
  DRAFT_DELETE_SUCCESS,
  DRAFT_FETCH_SUCCESS,
  TASK_CREATE_SUCCESS,
  TASK_DELETE_SUCCESS,
  TASK_FETCH_SUCCESS,
} from '../actionTypes';

type State = ImmutableMap<string, Domains>;

const INITIAL_STATE: State = new ImmutableMap();

const domainsReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case DOMAIN_FETCH_SUCCESS: {
      const {
        domainStoreData: { name, tasksDatabase },
        id,
        colonyENSName,
      } = action.payload;
      return state.setIn(
        [colonyENSName, id, 'domain'],
        Domain({
          tasksDatabase,
          name,
          id,
        }),
      );
    }
    case DRAFT_DELETE_SUCCESS:
    case TASK_DELETE_SUCCESS: {
      const { ensName, domainId, taskId } = action.payload;
      return state.removeIn([ensName, domainId, 'tasks', taskId]);
    }
    case DRAFT_FETCH_SUCCESS:
    case DRAFT_CREATE_SUCCESS: {
      const {
        ensName,
        domainId,
        draft: { id },
        draft,
      } = action.payload;
      return state.setIn([ensName, domainId, 'tasks', id], Draft(draft));
    }
    case TASK_FETCH_SUCCESS:
    case TASK_CREATE_SUCCESS: {
      const {
        ensName,
        domainId,
        task: { id },
        task,
      } = action.payload;
      return state.setIn([ensName, domainId, 'tasks', id], Task(task));
    }
    default:
      return state;
  }
};

export default domainsReducer;
