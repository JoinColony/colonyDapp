/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_FETCH,
  COLONY_FETCH_ERROR,
  COLONY_FETCH_SUCCESS,
} from '../actionTypes';

import { Colony, Token } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { ColonyRecord } from '~immutable';
import type { ENSName } from '~types';

// eslint-disable-next-line no-unused-vars
const coloniesReducer = (state = new ImmutableMap(), action) => state;

const enhance = withDataReducer<ENSName, ColonyRecord>(
  {
    error: COLONY_FETCH_ERROR,
    fetch: COLONY_FETCH,
    success: new Map([
      [
        COLONY_FETCH_SUCCESS,
        (
          state,
          {
            payload: {
              data: { token, ensName, ...data },
            },
          },
        ) =>
          Colony({
            ensName,
            token: Token(token),
            ...data,
          }),
      ],
    ]),
  },
  Colony,
);

export default enhance(coloniesReducer);
