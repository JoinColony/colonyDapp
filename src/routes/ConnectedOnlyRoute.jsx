/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { CONNECT_ROUTE } from './routeConstants';

import NavigationWrapper from '~components/pages/NavigationWrapper';

import type { RouteProps } from './types';

const ConnectedOnlyRoute = ({
  component: Component,
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
      if (isConnected) {
        const {
          match: { params },
        } = props;
        return hasNavigation ? (
          <NavigationWrapper {...rest}>
            <Component {...props} params={params} />
          </NavigationWrapper>
        ) : (
          <Component {...props} params={params} />
        );
      }
      return <Redirect to={CONNECT_ROUTE} />;
    }}
  />
);

export default ConnectedOnlyRoute;
