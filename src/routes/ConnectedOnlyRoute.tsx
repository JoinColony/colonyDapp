import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { CONNECT_ROUTE } from './routeConstants';

import NavigationWrapper from '~pages/NavigationWrapper';

import { RouteProps } from './types';

interface Props extends RouteProps {
  appearance?: any;
  backRoute?: any;
  backText?: any;
  backTextValues?: any;
  didClaimProfile?: boolean;
  exact?: boolean;
  hasBackLink?: boolean;
  hasNavigation?: boolean;
  isConnected?: boolean;
}

const ConnectedOnlyRoute = ({
  component: Component,
  path,
  isConnected,
  hasNavigation = true,
  hasBackLink,
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
              hasBackLink === undefined
                ? location.state && location.state.hasBackLink
                : hasBackLink
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
