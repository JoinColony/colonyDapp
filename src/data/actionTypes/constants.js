/* @flow */

export const CREATE_TOKEN = 'CREATE_TOKEN';
export const TOKEN_CREATED = 'TOKEN_CREATED';
export const CREATE_COLONY = 'CREATE_COLONY';
export const COLONY_CREATED = 'COLONY_CREATED';

export const SET_COLONY_CONTENT = 'SET_COLONY_CONTENT';
export const SET_DOMAIN_CONTENT = 'SET_DOMAIN_CONTENT';
export const SET_TASK_CONTENT = 'SET_TASK_CONTENT';

export const LOAD_COLONY = 'LOAD_COLONY';
export const FETCH_COLONY = 'FETCH_COLONY';

export const EDIT_COLONY = 'EDIT_COLONY';
export const UPDATE_COLONY = 'UPDATE_COLONY';

export const EDIT_DOMAIN = 'EDIT_DOMAIN';
export const UPDATE_DOMAIN = 'UPDATE_DOMAIN';

export const EDIT_TASK = 'EDIT_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

export const LOAD_DOMAIN = 'LOAD_DOMAIN';
export const RETURN_DOMAIN = 'RETURN_DOMAIN';

export const FETCH_COMMENTS = 'FETCH_COMMENTS';

export const JOIN_COLONY: string = 'JOIN_COLONY';
export const ADD_DOMAIN_TO_COLONY = 'ADD_DOMAIN_TO_COLONY';
export const ADD_TASK_TO_DOMAIN = 'ADD_TASK_TO_DOMAIN';
export const ADD_COMMENT_TO_TASK = 'ADD_COMMENT_TO_TASK';

export const STARTED_RESPONSE: string =
  'data API started and stored in context';

export const INITIALIZE_DATA = 'INITIALIZE_DATA';

export const INITIAL_STATE = {
  data: {
    colonies: { mycolony: { domains: [] } },
    domains: { mydomain: { tasks: [] } },
    profiles: {},
  },
};
