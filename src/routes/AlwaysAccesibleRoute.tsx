import React, { ComponentType } from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';

type routePropsFn = (params: any) => RouteComponentProps;

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  routeProps?: RouteComponentProps | routePropsFn;
}

const ConnectedOnlyRoute = ({
  component: Component,
  layout: Layout,
  path,
  routeProps = {},
}: Props) => {
  return (
    <Route
      path={path}
      /*
       * Render props that are passed directly to the route Component
       */
      render={(props) => {
        const {
          match: { params },
        } = props;
        const passedDownRouteProps =
          typeof routeProps !== 'function' ? routeProps : routeProps(params);
        return (
          <Layout routeProps={passedDownRouteProps} {...props}>
            <Component routeProps={passedDownRouteProps} {...props} />
          </Layout>
        );
      }}
    />
  );
};

export default ConnectedOnlyRoute;
