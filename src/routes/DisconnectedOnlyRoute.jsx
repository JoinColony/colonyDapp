/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import type { ComponentType } from 'react';

import { DASHBOARD_ROUTE } from './routeConstants';

const DisconnectedOnlyRoute = ({
  component: Component,
  isConnected,
  ...rest
}: {
  component: ComponentType<*>,
  isConnected?: boolean,
}) => (
  <Route
    {...rest}
    render={props => {
      if (isConnected) {
        const redirectTo =
          props.location.state && props.location.state.redirectTo;
        const location = {
          pathname: DASHBOARD_ROUTE,
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
