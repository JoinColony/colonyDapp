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
    render={props =>
      isConnected ? <Redirect to={DASHBOARD_ROUTE} /> : <Component {...props} />
    }
  />
);

export default DisconnectedOnlyRoute;
