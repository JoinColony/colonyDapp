import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { CONNECT_ROUTE } from './routeConstants';
import { RouteComponentProps } from '~pages/RouteLayouts';

type routePropsFn = (params: any) => RouteComponentProps;

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  isConnected?: boolean;
  routeProps?: RouteComponentProps | routePropsFn;
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
    render={(props) => {
      const {
        location,
        match: { params },
      } = props;
      const passedDownRouteProps =
        typeof routeProps !== 'function' ? routeProps : routeProps(params);
      if (isConnected) {
        return (
          <Layout routeProps={passedDownRouteProps} {...props}>
            <Component routeProps={passedDownRouteProps} {...props} />
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
