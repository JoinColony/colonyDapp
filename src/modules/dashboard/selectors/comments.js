/* @flow */

import type { RootState } from '~types';

import ns from '../namespace';

/*
 * Drafts selectors
 */
export const allCommentsSelector = (state: RootState) => state[ns].allComments;
