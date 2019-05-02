/* @flow */

import type { IBrowserHistory } from 'history';

import { CREATE_COLONY_ROUTE } from '~routes';

/**
 * Simple helper function to navigate
 * to create colony route which we would like to have since there's multiple
 * different occasions where we would like to do the same thing.
 *
 * @method unfinishedProfileOpener
 *
 */
const unfinishedProfileOpener = (history: IBrowserHistory) =>
  history.push(CREATE_COLONY_ROUTE);

export default unfinishedProfileOpener;
