import React, { ComponentType } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import { RouteComponentProps } from '~pages/RouteLayouts';

import { CREATE_USER_ROUTE } from './routeConstants';

type routePropsFn = (params: any) => RouteComponentProps;

interface Props extends RouteProps {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  routeProps?: RouteComponentProps | routePropsFn;
  isConnected?: boolean;
  didClaimProfile?: boolean;
}

const AlwaysAccesibleRoute = ({
  component: Component,
  layout: Layout,
  path,
  routeProps = {},
  isConnected = false,
  didClaimProfile = false,
}: Props) => {
  /*
   * The create user route should not be accessible through this component,
   * so this check here *should* not be required as the CREATE_USER_ROUTE should
   * only be rendered via a route component that already has a wallet connected,
   * and not via this, always accessible one.
   *
   * We have it here to prevent future headaches.
   */
  if (isConnected && !didClaimProfile && path !== CREATE_USER_ROUTE) {
    return <Redirect to={CREATE_USER_ROUTE} />;
  }
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

export default AlwaysAccesibleRoute;
