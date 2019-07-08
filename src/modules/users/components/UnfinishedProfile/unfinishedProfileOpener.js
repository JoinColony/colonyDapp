/* @flow */

import type { IBrowserHistory } from 'history';

import { CREATE_USER_ROUTE } from '~routes';

/**
 * Simple helper function to navigate to the create user route
 * which we would like to have since there's multiple
 * different occasions where we would like to do the same thing.
 *
 * @method unfinishedProfileOpener
 *
 */
const unfinishedProfileOpener = (history: IBrowserHistory) =>
  history.push(CREATE_USER_ROUTE);

export default unfinishedProfileOpener;
