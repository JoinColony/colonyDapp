import React, { ComponentType } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { RouteProps } from './types';
import { CREATE_USER_ROUTE, DASHBOARD_ROUTE } from './routeConstants';

interface Props extends RouteProps {
  component: ComponentType<any>;
  didClaimProfile?: boolean;
  isConnected?: boolean;
}

const DisconnectedOnlyRoute = ({
  component: Component,
  didClaimProfile,
  isConnected,
  ...rest
}: Props) => (
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
