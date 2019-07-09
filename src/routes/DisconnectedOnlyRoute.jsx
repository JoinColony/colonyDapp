/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import type { ComponentType } from 'react';

import { CREATE_USER_ROUTE, DASHBOARD_ROUTE } from './routeConstants';

const DisconnectedOnlyRoute = ({
  component: Component,
  didClaimProfile,
  isConnected,
  ...rest
}: {
  component: ComponentType<*>,
  didClaimProfile?: boolean,
  isConnected?: boolean,
}) => (
  <Route
    {...rest}
    render={props => {
      if (isConnected) {
        const redirectTo =
          props.location.state && props.location.state.redirectTo;
        const location = {
          pathname: didClaimProfile ? DASHBOARD_ROUTE : CREATE_USER_ROUTE,
          ...redirectTo,
          state: { hasBackLink: false },
        };
        return <Redirect to={location} />;
      }
      return <Component {...props} />;
    }}
  />
);

export default DisconnectedOnlyRoute;
