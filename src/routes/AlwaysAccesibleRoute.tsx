import React, { ComponentType } from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';

type routePropsFn = (params: any) => RouteComponentProps;

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  routeProps?: RouteComponentProps | routePropsFn;
}

const AlwaysAccesibleRoute = ({
  component: Component,
  layout: Layout,
  path,
  routeProps = {},
}: Props) => (
  <Route
    path={path}
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

export default AlwaysAccesibleRoute;
