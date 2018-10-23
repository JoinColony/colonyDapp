/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import type { ComponentType } from 'react';

import { CONNECT_ROUTE } from './routeConstants';

import NavigationWrapper from '~pages/NavigationWrapper';

type Props = {
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
   * Wheater or not to wrap the route's component inside the NavigationBar
   */
  hasNavigation?: boolean,
};

const ConnectedOnlyRoute = ({
  component: Component,
  isConnected,
  hasNavigation = true,
  path,
  /*
   * ConnectedRoute props that are passed directly to the NavigationBar
   */
  ...rest
}: Props) => (
  <Route
    path={path}
    /*
     * Render props that are passed directly to the route Component
     */
    render={props => {
      if (isConnected) {
        return hasNavigation ? (
          <NavigationWrapper {...rest}>
            <Component {...props} />
          </NavigationWrapper>
        ) : (
          <Component {...props} />
        );
      }
      return <Redirect to={CONNECT_ROUTE} />;
    }}
  />
);

export default ConnectedOnlyRoute;
