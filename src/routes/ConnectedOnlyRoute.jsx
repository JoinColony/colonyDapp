/* @flow */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import type { Component as ReactComponent } from 'react';

import { START_ROUTE } from './routeConstants';

const ConnectedOnlyRoute = ({
  component: Component,
  isConnected,
  ...rest
}: {
  component: ReactComponent,
  isConnected?: boolean,
}) => (
  <Route
    {...rest}
    render={props =>
      isConnected ? <Component {...props} /> : <Redirect to={START_ROUTE} />
    }
  />
);

export default ConnectedOnlyRoute;
