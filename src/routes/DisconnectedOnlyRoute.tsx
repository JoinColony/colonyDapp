import React, { ComponentType } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps as ReactRouterComponentProps,
} from 'react-router-dom';

import { StaticContext } from 'react-router';
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
  // didClaimProfile,
  isConnected,
  layout: Layout,
  routeProps,
}: Props) => {
  return (
    <Route
      render={(
        props: ReactRouterComponentProps<
          {},
          StaticContext,
          { redirectTo?: Location }
        >,
      ) => {
        if (isConnected) {
          const redirectTo =
            props.location.state && props.location.state.redirectTo;
          let pathname = DASHBOARD_ROUTE;
          // if (!ethereal) {
          //   pathname = CREATE_USER_ROUTE;
          // }
          const location = {
            // pathname: didClaimProfile ? DASHBOARD_ROUTE : CREATE_USER_ROUTE,
            pathname,
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
};

export default DisconnectedOnlyRoute;
