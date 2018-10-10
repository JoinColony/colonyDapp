/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import type { ComponentType } from 'react';

import { CONNECT_ROUTE } from './routeConstants';

const ConnectedOnlyRoute = ({
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
      isConnected ? <Component {...props} /> : <Redirect to={CONNECT_ROUTE} />
    }
  />
);

export default ConnectedOnlyRoute;
