import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { CONNECT_ROUTE } from './routeConstants';
import { RouteComponentProps } from '~pages/RouteLayouts';

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  isConnected?: boolean;
  routeProps?: RouteComponentProps;
}

const ConnectedOnlyRoute = ({
  component: Component,
  layout: Layout,
  path,
  isConnected,
  routeProps = {},
}: Props) => (
  <Route
    path={path}
    /*
     * Render props that are passed directly to the route Component
     */
    render={props => {
      const { location } = props;
      if (isConnected) {
        return (
          <Layout routeProps={routeProps} {...props}>
            <Component routeProps={routeProps} {...props} />
          </Layout>
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
