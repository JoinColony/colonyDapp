import React, { ComponentType } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps as ReactRouterComponentProps,
} from 'react-router-dom';
import { Location } from 'history';

import { StaticContext } from 'react-router';
import { RouteComponentProps } from '~pages/RouteLayouts';

import {
  CREATE_USER_ROUTE,
  DASHBOARD_ROUTE,
  CONNECT_ROUTE,
  CREATE_COLONY_ROUTE,
} from './routeConstants';

interface ComponentProps extends RouteProps {
  routeProps?: RouteComponentProps;
}

interface Props extends RouteProps {
  component: ComponentType<ComponentProps>;
  layout: ComponentType<ComponentProps>;
  didClaimProfile?: boolean;
  isConnected?: boolean;
  routeProps?: RouteComponentProps;
  path?: string;
}

const WalletRequiredRoute = ({
  component: Component,
  didClaimProfile,
  isConnected,
  layout: Layout,
  routeProps,
  path,
}: Props) => {
  return (
    <Route
      render={(
        props: ReactRouterComponentProps<
          {},
          StaticContext,
          { redirectTo?: Location | string }
        >,
      ) => {
        if (isConnected) {
          const redirectTo =
            props.location.state && props.location.state.redirectTo;
          if (didClaimProfile) {
            if (redirectTo) {
              return <Redirect to={redirectTo} />;
            }
            if (path === CONNECT_ROUTE) {
              return <Redirect to={DASHBOARD_ROUTE} />;
            }
            return (
              <Layout routeProps={routeProps} {...props}>
                <Component routeProps={routeProps} {...props} />
              </Layout>
            );
          }
          if (redirectTo === CREATE_COLONY_ROUTE) {
            return <Redirect to={CREATE_COLONY_ROUTE} />;
          }
          if (path === CREATE_COLONY_ROUTE) {
            return (
              <Layout routeProps={routeProps} {...props}>
                <Component routeProps={routeProps} {...props} />
              </Layout>
            );
          }
          if (path !== CREATE_USER_ROUTE) {
            return (
              <Redirect
                to={{
                  pathname: CREATE_USER_ROUTE,
                  state: {
                    redirectTo: path,
                  },
                }}
              />
            );
          }
        }
        if (!isConnected && path !== CONNECT_ROUTE) {
          return (
            <Redirect
              to={{
                pathname: CONNECT_ROUTE,
                state: {
                  redirectTo: path,
                },
              }}
            />
          );
        }
        /**
         * Catch all component render
         */
        return (
          <Layout routeProps={routeProps} {...props}>
            <Component routeProps={routeProps} {...props} />
          </Layout>
        );
      }}
    />
  );
};

export default WalletRequiredRoute;
