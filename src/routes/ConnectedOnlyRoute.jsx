/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { CONNECT_ROUTE } from './routeConstants';

import NavigationWrapper from '~pages/NavigationWrapper';

import type { RouteProps } from './types';

const ConnectedOnlyRoute = ({
  component: Component,
  hasBackLink,
  isConnected,
  hasNavigation = true,
  path,
  /*
   * ConnectedRoute props that are passed directly to the NavigationBar
   */
  ...rest
}: RouteProps) => (
  <Route
    path={path}
    /*
     * Render props that are passed directly to the route Component
     */
    render={props => {
      const {
        match: { params },
        location,
      } = props;
      if (isConnected) {
        // We disable the back link for locations we redirect to from /connect
        return hasNavigation ? (
          <NavigationWrapper
            {...rest}
            hasBackLink={
              hasBackLink === false
                ? false
                : location.state && location.state.hasBackLink
            }
          >
            <Component {...props} params={params} />
          </NavigationWrapper>
        ) : (
          <Component {...props} params={params} />
        );
      }
      return (
        <Redirect
          to={{
            pathname: CONNECT_ROUTE,
            state: { redirectTo: location },
          }}
        />
      );
    }}
  />
);

export default ConnectedOnlyRoute;
