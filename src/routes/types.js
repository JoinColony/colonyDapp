/* @flow */

import type { ComponentType } from 'react';

export type RouteProps = {
  /*
   * Route path
   */
  path: string,
  /*
   * Component to render (with or without navigation)
   */
  component: ComponentType<*>,
  /*
   * Authorization check
   *
   * If we're connected to a wallet, proceed to the designated route, otherwise
   * redirect to the start page (connect route)
   */
  isConnected?: boolean,
  /*
   * Whether or not to display the back navigation link
   */
  hasBackLink?: boolean,
  /*
   * Wheater or not to wrap the route's component inside the NavigationBar
   */
  hasNavigation?: boolean,
};
