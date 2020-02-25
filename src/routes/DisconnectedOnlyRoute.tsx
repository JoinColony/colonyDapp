import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';

import { CREATE_USER_ROUTE, DASHBOARD_ROUTE } from './routeConstants';

interface ComponentProps extends RouteProps {
  routeProps?: RouteComponentProps;
}

interface Props extends RouteProps {
  component: ComponentType<ComponentProps>;
  layout: ComponentType<ComponentProps>;
  didClaimProfile?: boolean;
  isConnected?: boolean;
  routeProps?: RouteComponentProps;
}

const DisconnectedOnlyRoute = ({
  component: Component,
  didClaimProfile,
  isConnected,
  layout: Layout,
  routeProps,
}: Props) => (
  <Route
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
      return (
        <Layout routeProps={routeProps} {...props}>
          <Component routeProps={routeProps} {...props} />
        </Layout>
      );
    }}
  />
);

export default DisconnectedOnlyRoute;
